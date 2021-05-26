import { WorkerContext } from '../../WorkerContext';
import { IbmsEvent, IEventTransformer } from "./Event";
import { isNull } from "./Util";

// 切换区域事件转换器名称
export const REGION_TRANSFORMER_NAME = "region.transformer";

/**
 * 区域事件
 */
export abstract class RegionEvent extends IbmsEvent {

    private readonly _regionId: string;

    constructor(builder: RegionEventBuilder){
        super();
        this._regionId = isNull(builder.regionId, "\"regionId\" cannot be null.");
    }

    /**
     * 区域编号
     */
    get regionId(){
        return this._regionId;
    }

    /**
     * 对应的转换器
     */
    get transformerName(): string {
        return REGION_TRANSFORMER_NAME;
    }
}

/**
 * 切换区域事件
 */
export class SwitchRegionEvent extends RegionEvent {


    constructor(builder: SwitchRegionEventBuilder) {
        super(builder);
    }
    // @ts-ignore
    getMessage(source: string): string {
        return "将当前工作区域切换为编号为[" + this.regionId + "]区域.";
    }

}

/**
 *
 */
export class RegionInitializedEvent extends RegionEvent {

    constructor(builder: RegionInitializedEventBuilder){
        super(builder);

    }

    // @ts-ignore
    getMessage(source: string): string {
        return "当前工作区域设备和场景已经完成初始化.";
    }
}

/**
 * 用于加载当前区域的设备子系统、设备事件
 */
export class RegionInitializingEvent extends RegionEvent {

    constructor(builder: RegionInitializingEventBuilder){
        super(builder);

    }

    // @ts-ignore
    getMessage(source: string): string {
        return "当前工作区域设备和场景已经完成初始化.";
    }
}


/**
 * 区域事件构建器
 */
export abstract class RegionEventBuilder  {
    // @ts-ignore
    private _regionId: string;

    /**
     * 区域编号
     */
    get regionId(): string{
        return this._regionId;
    }

    /**
     * 设置区域编号
     * @param value
     */
    withRegionId(value: string): RegionEventBuilder{
        this._regionId = value;
        return this;
    }


}

/**
 * 切换区域事件构建器
 */
export class SwitchRegionEventBuilder extends RegionEventBuilder {

    constructor(){
        super();
    }

    build(): SwitchRegionEvent {
        return new SwitchRegionEvent(this);
    }
}

/**
 * 区域初始化完成事件
 */
export class RegionInitializedEventBuilder extends RegionEventBuilder {
    constructor(){
        super();
    }

    build(): RegionInitializedEvent{
        return new RegionInitializedEvent(this);
    }
}

export class RegionInitializingEventBuilder extends RegionEventBuilder {
    constructor(){
        super();
    }

    build(): RegionInitializingEvent{
        return new RegionInitializingEvent(this);
    }
}

/**
 * 区域事件转换器
 */
export class RegionEventTransformer implements IEventTransformer<RegionEvent> {


    tranformTo(event: RegionEvent): Object[] {
        let result = new Array<Object>();

        result.push(REGION_TRANSFORMER_NAME);
        if (event instanceof SwitchRegionEvent){
            result.push(0);
            this.transformWithSwitchRegion(event, result);
            return result;
        }

        if (event instanceof RegionInitializedEvent){
            result.push(1);
            this.transformWithRegionInitialized(event, result);
            return result;
        }

        throw new Error("transformer  failed: unknown event.");
    }

    /**
     * 转换切换区域事件
     * @param evnet 事件
     * @param arr 数组
     */
    private transformWithSwitchRegion(event: SwitchRegionEvent, arr: Array<Object>) : void{
        arr.push(event.regionId);
    }

    /**
     * 解析切换功能区事件
     * @param obj 数组
     */
    private parseToSwitchRegionEvent(obj: Object[]): SwitchRegionEventBuilder{
        let result = new SwitchRegionEventBuilder();
        result.withRegionId(obj[2].toString());
        return result;
    }

    /**
     * 转换区域初始化完成事件
     * @param event
     * @param arr
     */
    private transformWithRegionInitialized(event: RegionInitializedEvent, arr: Array<Object>): void{
        arr.push(event.regionId);
    }

    /**
     * 解析区域初始化完成事件
     * @param obj
     */
    private parseToRegionInitializedEvent(obj: Object[]) : RegionInitializedEventBuilder {
        let result = new RegionInitializedEventBuilder();
        result.withRegionId(obj[2].toString());
        return result;
    }

    parseFrom(obj: Object[]): RegionEvent {
        // @ts-ignore
        if (!obj) return null;

        let type = obj[1];
        // @ts-ignore
        let result: RegionEvent = null;

        switch (type){
        case 0 :
            result = this.parseToSwitchRegionEvent(obj).build();
            break;

        case 1 :
            result = this.parseToRegionInitializedEvent(obj).build();
        }

        return result;
    }

}

//   // @ts-ignore
// if( globalThis.context ){
  
//   console.log('workertime runtime');
//   // @ts-ignore
//   let context = globalThis.context;
//   if( context ){
//     // @ts-ignore
//     context.transformers.addEventTransformer(REGION_TRANSFORMER_NAME, new RegionEventTransformer());
//   }
// }
// else{
//   console.log('workertime workertime');
// // @ts-ignore
//   console.log(context);
// // @ts-ignore
//   let workerContext: WorkerContext = self.context;

//   console.log(workerContext);
  
//   if( workerContext ){
//     // @ts-ignore
//     workerContext.transformers.addEventTransformer(REGION_TRANSFORMER_NAME, new RegionEventTransformer());
//     console.log('注册成功！');
//   }
// }
