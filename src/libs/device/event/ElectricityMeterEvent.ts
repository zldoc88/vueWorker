/**
 * Project: ibms-worker
 * Author: SN-510S-A
 * Email: 2726893248@qq.com
 * CreateDate: 2020-12-18 15:14:52
 * IDE: WebStorm
 */

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

    // 电表事件转换器名称， 针对电表发生变化事件
export const  DEVICE_ELECTRICITY_TRANSFORMER_NAME = "device.electricity.transformer";

/**
 * 电表事件
 */
export abstract class ElectricityEvent extends DeviceEvent {

    constructor(builder: ElectricityEventBuilder){
        super(builder);
    }

    get transformerName(){
        return DEVICE_ELECTRICITY_TRANSFORMER_NAME;
    }
}

/**
 * 电表值改变事件
 */
export class ElectricityChangedEvent extends ElectricityEvent {

    private readonly _value: number;

    constructor(builder: ElectricityChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 电表值
     */
    get value(): number{
        return this._value;
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 电表值改变为" + this._value +"。";
        }
        return "设备[id=" + this.id + "] 电表值改变为" + this._value +"。";
    }
}

/**
 * 电表事件构建器
 */
export abstract class ElectricityEventBuilder extends DeviceEventBuilder {

    constructor(){
        super();
    }

}
/**
 * 电表值改变事件
 */
export class ElectricityChangedEventBuilder extends ElectricityEventBuilder {

    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 电表值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置电表值
     * @param value 电表值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): ElectricityChangedEvent{
        return new ElectricityChangedEvent(this);
    }
}

/**
 * 电表事件转换器
 */
export class ElectricityEventTransformer implements IEventTransformer<ElectricityEvent> {

    tranformTo(event: ElectricityEvent): Object[] {
        let result = new Array<Object>();

        result.push(DEVICE_ELECTRICITY_TRANSFORMER_NAME);
        if (event instanceof ElectricityChangedEvent){
            result.push(1);
            this.tranformChangedEvent(event, result);
        }
        return result;

    }

    parseFrom(obj: Object[]): ElectricityEvent {
        let type = obj[1];
        let result = null;
        switch (type){
        case 1: {
            result = this.parseToElectricityEvent(obj);
            break;
        }
        }

        // @ts-ignore
        return result;
    }

    /**
     * 转换电表改变事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformChangedEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
        result.push(event.value);
    }


    /**
     * 解析数组为电表改变事件
     * @param obj  数组
     */
    parseToElectricityEvent(obj: Object[]) : ElectricityChangedEvent {
        let builder = new ElectricityChangedEventBuilder();
        builder.withId(obj[2].toString());
        builder.withValue((Number)(obj[3]));

        return builder.build();
    }


}