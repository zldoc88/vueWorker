/**
 * Project: ibms-worker
 * Author: SN-510S-A
 * Email: 2726893248@qq.com
 * CreateDate: 2020-12-18 14:42:45
 * IDE: WebStorm
 */

import { isNull } from '../../event/Util';
import {
    DeviceBasisEvents
   /* DeviceEvent,
    DeviceEventBuilder,*/
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

/***********************************
 ********            常量          ************
 * *********************************/
export module WaterBasisEvents{
    // 水表事件转换器名称， 针对水表发生变化事件
    export const  DEVICE_WATER_TRANSFORMER_NAME = "device.water.transformer";

    /**
     * 水表事件
     */
    export abstract class WaterEvent extends DeviceBasisEvents.DeviceEvent {

        constructor( builder: WaterEventBuilder){
            super(builder);
        }



        get transformerName(){
            return DEVICE_WATER_TRANSFORMER_NAME;
        }
    }

    /**
     * 水表值改变事件
     */
    export class WaterChangedEvent extends WaterEvent {

        private readonly _value: number;

        constructor(builder: WaterChangedEventBuilder){
            super(builder);
            this._value = isNull(builder.value, "\"value\" cannot be null.");
        }

        /**
         * 水表值
         */
        get value(): number{
            return this._value;
        }

        /**
         * 消息
         */
        getMessage(source: string): string{
            if (source){
                return source +  "[id=" + this.id + "] 水表值改变为" + this._value +"。";
            }
            return "设备[id=" + this.id + "] 水表值改变为" + this._value +"。";
        }
    }

    /**
     * 水表事件构造器
     */
    export abstract class WaterEventBuilder extends DeviceBasisEvents.DeviceEventBuilder {

        constructor(){
            super();
        }
    }


    /**
     * 水表值改变事件
     */
    export class WaterChangedEventBuilder extends WaterEventBuilder {

        // @ts-ignore
        private _value: number;

        constructor(){
            super();
        }

        /**
         * 水表值
         */
        get value(): number{
            return this._value;
        }

        /**
         * 设置水表值
         * @param value 水表值
         */
        withValue(value: number){
            this._value = value;
            return this;
        }

        build(): WaterChangedEvent{
            return new WaterChangedEvent(this);
        }
    }

    /**
     * 水表事件转换器
     */
    export class WaterEventTransformer implements IEventTransformer<WaterEvent> {

        tranformTo(event: WaterEvent): Object[] {
            let result = new Array<Object>();

            result.push(DEVICE_WATER_TRANSFORMER_NAME);
            if (event instanceof WaterChangedEvent){
                result.push(1);
                this.tranformWaterEvent(event, result);
            }
            return result;

        }

        parseFrom(obj: Object[]): WaterEvent {
            let type = obj[1];
            let result = null;
            switch (type){
                case 1: {
                    result = this.parseToWaterEvent(obj);
                    break;
                }
            }
            // @ts-ignore
            return result;
        }

        /**
         * 转换水表改变事件
         * @param event  事件
         * @param result  返回的数组
         */
        tranformWaterEvent( event: any, result: Array<Object>): void{
            //按次序处理
            result.push (event.id);
            result.push(event.value);
        }

        /**
         * 解析数组为水表改变事件
         * @param obj  数组
         */
        parseToWaterEvent(obj: Object[]) : WaterChangedEvent {
            let builder = new WaterChangedEventBuilder();
            builder.withId(obj[2].toString());
            builder.withValue((Number)(obj[3]));
            return builder.build();
        }


    }
}
