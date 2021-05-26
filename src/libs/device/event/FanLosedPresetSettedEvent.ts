/**
 * Project: DeviceEvent
 * Author: DELL_SN2020QAQ
 * Email: 2726893248@qq.com
 * CreateDate: 2020-12-02 13:58:13
 * IDE: WebStorm
 */
import { isNull } from '../../event/Util';
import {
    DeviceBasisEvents
    /*DeviceEvent,
    DeviceEventBuilder,*/
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

export module FanLosedPresetBasisEvents{

export const DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME = "device.fanLosedPreset.transformer";

/**
 * 闭环控制事件
 */
export abstract class FanLosedPresetEvent extends DeviceBasisEvents.DeviceEvent{

    constructor(builder: FanLosedPresetEventBuilder) {
        super(builder);
    }

    get transformerName(){
        return DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME;
    }

}

/**
 * 闭环控制设定值已重置事件
 */
export class FanLosedPresetSettedEvent extends FanLosedPresetEvent{

    private readonly _value: number;

    constructor(builder: FanLosedPresetSettedEventBuilder){
        super(builder);
        this._value = isNull( builder.value, "\"value\" cannot be null. " );
    }

    /**
     *闭环控制设定值
     */
    get value():number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 闭环控制设置值重定为" + this._value +"。";
        }
        return "设备[id=" + this.id + "] 闭环控制设置值重定为" + this._value +"。";
    }

}

/**
 * 闭环控制设定值已重置事件转换器
 */
export class FanLosedPresetSettedToArrayEventTransformer implements IEventTransformer<FanLosedPresetEvent>{

    tranformTo(event: FanLosedPresetEvent):Object[]{
        let result = new Array<Object>();

        result.push(DEVICE_FANLOSEDPRESET_TRANSFORMER_NAME);
        if( event instanceof FanLosedPresetSettedEvent){
            result.push(1);
            this.tranformChangedEvent(event,result);
        }

        return result;
    }

    parseFrom(obj: Object[]): FanLosedPresetEvent{
        let type = obj[1];
        let result = null;
        switch( type ){
            case 1:{
                result = this.parseToChangedEvent(obj);
                break;
            }
        }

        // @ts-ignore
        return result;
    }

    /**
     *
     * @param {FanLosedPresetSettedEvent} event
     * @param {Array<Object>} result
     */
    tranformChangedEvent(event: FanLosedPresetSettedEvent, result: Array<Object>): void{

        result.push(event.id);
        result.push(event.value);

    }

    parseToChangedEvent(obj: Object[]): FanLosedPresetSettedEvent{
        let builder = new FanLosedPresetSettedEventBuilder();
        builder.withId(obj[2].toString());
        builder.withValue((Number)(obj[3]));

        return builder.build();
    }


}




/**
 * 闭环控制事件构建器
 */
export abstract  class FanLosedPresetEventBuilder extends DeviceBasisEvents.DeviceEventBuilder{

    constructor() {
        super();
    }

}

/**
 *闭环控制设置值已重置事件
 */
export class FanLosedPresetSettedEventBuilder extends FanLosedPresetEventBuilder{

    // @ts-ignore
    private _value: number;

    constructor() {
        super();
    }

    /**
     * 闭环控制设置值
     * @returns {number}
     */
    get value(): number{
        return this._value;
    }

    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): FanLosedPresetSettedEvent{
        return new FanLosedPresetSettedEvent(this);
    }


}

}