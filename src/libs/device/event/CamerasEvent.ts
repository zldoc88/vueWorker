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
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

/***********************************
 ********            常量          ************
 * *********************************/
export module CamerasBasisEvents{
    // 水表事件转换器名称， 针对水表发生变化事件
    export const  DEVICE_CAMERAS_TRANSFORMER_NAME = "device.cameras.transformer";

    /**
     * 水表事件
     */
    export abstract class CamerasEvent extends DeviceBasisEvents.DeviceEvent {
        // @ts-ignore
        private _value: number;

        constructor( builder: CamerasEventBuilder){
            super(builder);
            // @ts-ignore
            this._value = isNull(builder.value, "\"value\" cannot be null.");
        }

        get transformerName(){
            return DEVICE_CAMERAS_TRANSFORMER_NAME;
        }
        /**
         * 用水量
         */
        get value(){
            return this._value;
        }
    }

    /**
     * 水表读数采集事件
     */
        // @ts-ignore
    export class IBMS_CamerasChangedEvent extends CamerasEvent {

        private readonly _value: number;

        constructor(builder: CamerasChangedEventBuilder){
            super(builder);
            this._value = isNull(builder.value, "\"value\" cannot be null.");
        }

        /**
         * 水表读数
         */
        get value(): number{
            return this._value;
        }

        /**
         * 消息
         */
        getMessage(source: string): string{
            if (source){
                return source +  "[id=" + this.id + "] 水表读数采集事件" + this._value +"。";
            }
            return "设备[id=" + this.id + "] 水表读数采集事件" + this._value +"。";
        }
    }
    /**
     * 水表值改变事件
     */
        // @ts-ignore

    export class CamerasChangedEvent extends CamerasEvent {

        private readonly _value: number;

        constructor(builder: CamerasChangedEventBuilder){
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
                return source +  "[id=" + this.id + "] 水表读数采集事件值" + this._value +"。";
            }
            return "设备[id=" + this.id + "] 水表读数采集事件值" + this._value +"。";
        }
    }

    /**
     * 水表事件构造器
     */
    export abstract class CamerasEventBuilder extends DeviceBasisEvents.DeviceEventBuilder {

        constructor(){
            super();
        }
    }


    /**
     * 水表值改变事件
     */
    export class CamerasChangedEventBuilder extends CamerasEventBuilder {

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

        build(): CamerasChangedEvent{
            return new CamerasChangedEvent(this);
        }
    }

    /**
     * 水表事件转换器
     */
    export class CamerasEventTransformer implements IEventTransformer<CamerasEvent> {

        tranformTo(event: CamerasEvent): Object[] {
            let result = new Array<Object>();

            result.push(DEVICE_CAMERAS_TRANSFORMER_NAME);
            if (event instanceof CamerasChangedEvent){
                result.push(1);
                this.tranformCamerasEvent(event, result);
            }
            return result;

        }

        parseFrom(obj: Object[]): CamerasEvent {
            let type = obj[1];
            let result = null;
            switch (type){
                case 1: {
                    result = this.parseToCamerasEvent(obj);
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
        tranformCamerasEvent( event: any, result: Array<Object>): void{
            //按次序处理
            result.push (event.id);
            result.push(event.value);
        }

        /**
         * 解析数组为水表改变事件
         * @param obj  数组
         */
        parseToCamerasEvent(obj: Object[]) : CamerasChangedEvent {
            let builder = new CamerasChangedEventBuilder();
            builder.withId(obj[2].toString());
            builder.withValue((Number)(obj[3]));
            return builder.build();
        }


    }
}

