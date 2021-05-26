import { isNull } from '../../event/Util';
import {
    DeviceEvent,
    DeviceEventBuilder,
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

/***********************************
 ********            常量          ************
 * *********************************/

    // 设备生命周期事件转换器名称， 针对设备安装(检测)，投产，维保，卸载事件
export const  DEVICE_DAMPNESS_TRANSFORMER_NAME = "device.dampness.transformer";

/**
 * 湿度事件
 */
export abstract class DampnessEvent extends DeviceEvent {

    constructor(builder: DampnessEventBuilder){
        super(builder);
    }

    get transformerName(){
        return DEVICE_DAMPNESS_TRANSFORMER_NAME;
    }
}



/**
 * 湿度事件构建器
 */
export abstract class DampnessEventBuilder extends DeviceEventBuilder {

    constructor(){
        super();
    }

}

/**
 * 湿度值改变事件
 */
export class DampnessChangedEvent extends DampnessEvent {

    private readonly _value: number;

    constructor(builder: DampnessChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 湿度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 湿度值改变为" + this._value +".";
        }
        return "设备[id=" + this.id + "] 湿度值改变为" + this._value +".";
    }
}

/**
 * 湿度控制已重置事件
 */
export class DampnessSettedEvent extends DampnessEvent {

    private readonly _value: number;

    constructor(builder: DampnessSettedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 湿度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 湿度值已重置为" + this._value +".";
        }
        return "设备[id=" + this.id + "] 湿度值已重置为" + this._value +".";
    }
}


/**
 * 湿度事件转换器
 */
export class DampnessToArrayEventTransformer implements IEventTransformer<DampnessEvent> {

    tranformTo(event: DampnessEvent): Object[] {
        let result = new Array<Object>();

        result.push(DEVICE_DAMPNESS_TRANSFORMER_NAME);
        if (event instanceof DampnessChangedEvent){
            result.push(1);
            this.tranformChangedEvent(event, result);
        }
        else if( event instanceof DampnessSettedEvent ){
            result.push(2);
            this.tranformSettedEvent(event, result);
        }
        return result;
        
    }

    parseFrom(obj: Object[]): DampnessEvent {
        let type = obj[1];
        let result = null;
        switch (type){
            case 1: {
                result = this.parseToChangedEvent(obj);
                break;
            }
            case 2: {
                result = this.parseToSettedEvent(obj);
                break;
            }
        }

        // @ts-ignore
        return result;
    }

    /**
     * 转换湿度改变事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformChangedEvent( event: DampnessChangedEvent, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
        result.push(event.value);
    }

    /**
     * 解析数组为湿度改变事件
     * @param obj  数组
     */
    parseToChangedEvent(obj: Object[]) : DampnessChangedEvent {
        let builder = new DampnessChangedEventBuilder();
        builder.withId(obj[2].toString());
        builder.withValue((Number)(obj[3]));

        return builder.build();
    }

    /**
     * 转换湿度控制已重置事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformSettedEvent( event: DampnessSettedEvent, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
        result.push(event.value);
    }

    /**
     * 解析数组为控制已重置改变事件
     * @param obj  数组
     */
    parseToSettedEvent(obj: Object[]) : DampnessSettedEvent {
        let builder = new DampnessSettedEventBuilder();
        builder.withId(obj[2].toString());
        builder.withValue((Number)(obj[3]));

        return builder.build();
    }

}

/**
 * 湿度值改变事件
 */
export class DampnessChangedEventBuilder extends DampnessEventBuilder {

    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 湿度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置湿度值
     * @param value 湿度值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): DampnessChangedEvent{
        return new DampnessChangedEvent(this);
    }
}

/**
 * 湿度控制已重置事件
 */
export class DampnessSettedEventBuilder extends DampnessEventBuilder {

    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 湿度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置湿度值
     * @param value 湿度值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): DampnessSettedEvent{
        return new DampnessSettedEvent(this);
    }
}