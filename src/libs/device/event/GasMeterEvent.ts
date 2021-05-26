/**
 * Project: ibms-worker
 * Author: SN-510S-A
 * Email: 2726893248@qq.com
 * CreateDate: 2020-12-19 10:50:04
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

    // 气表事件转换器名称， 针对气表发生变化事件
export const  DEVICE_GAS_TRANSFORMER_NAME = "device.gas.transformer";

/**
 * 气表事件
 */
export abstract class GasMeterEvent extends DeviceEvent {

    constructor(builder: GasMeterEventBuilder){
        super(builder);
    }

    get transformerName(){
        return DEVICE_GAS_TRANSFORMER_NAME;
    }
}

/**
 * 气表值发生改变事件
 */
export class GasChangedEvent extends GasMeterEvent {

    private readonly _value: number;

    constructor(builder: GasChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 气表值
     */
    get value(): number{
        return this._value;
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 气表值改变为" + this._value +".";
        }
        return "设备[id=" + this.id + "] 气表值改变为" + this._value +".";
    }
}

/**
 * 气表事件构建器
 */
export abstract class GasMeterEventBuilder extends DeviceEventBuilder {

    constructor(){
        super();
    }

}
/**
 * 气表值改变事件
 */
export class GasChangedEventBuilder extends GasMeterEventBuilder {

    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 气表值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置气表值
     * @param value 气表值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): GasChangedEvent{
        return new GasChangedEvent(this);
    }
}

/**
 * 气表事件转换器
 */
export class GasMeterEventformer implements IEventTransformer<GasMeterEvent> {

    tranformTo(event: GasMeterEvent): Object[] {
        let result = new Array<Object>();

        result.push(DEVICE_GAS_TRANSFORMER_NAME);
        if (event instanceof GasChangedEvent){
            result.push(1);
            this.tranformEvent(event, result);
        }
        return result;

    }

    parseFrom(obj: Object[]): GasMeterEvent {
        let type = obj[1];
        let result = null;
        switch (type){
        case 1: {
            result = this.parseToEvent(obj);
            break;
        }
        }

        // @ts-ignore
        return result;
    }

    /**
     * 转换气表改变事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
        result.push(event.value);
    }


    /**
     * 解析数组为气表改变事件
     * @param obj  数组
     */
    parseToEvent(obj: Object[]) : GasChangedEvent {
        let builder = new GasChangedEventBuilder();
        builder.withId(obj[2].toString());
        builder.withValue((Number)(obj[3]));

        return builder.build();
    }


}
