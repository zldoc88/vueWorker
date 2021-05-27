/**
 * Project: sn-data-center-platform-micro-front-web
 * Author: SN-510S-A
 * Email: 2726893248@qq.com
 * CreateDate: 2021-04-23 09:51:23
 * IDE: WebStorm
 */


//import { isNull } from '../../event/Util';
import {
    DeviceBasisEvents
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

export module FanCoilBasisEvent{
/***********************************
 ********            常量          ************
 * *********************************/

    // 风机盘管事件转换器名称， 针对风机设备事件
export const  DEVICE_FanCoil_TRANSFORMER_NAME = "device.fancoil.transformer";

/**
 * 风机盘管事件
 */
export abstract class FanCoilEvent extends DeviceBasisEvents.DeviceEvent {

    constructor(builder: FanCoilEventBuilder){
        super(builder);
    }

    get transformerName(){
        return DEVICE_FanCoil_TRANSFORMER_NAME;
    }
}

/**
 * 读当前风机设备事件
 */
export class ReadFanEvent extends FanCoilEvent {

    //private readonly _value: number;

    constructor(builder: ReadFanEventBuilder){
        super(builder);
        //this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    ///**
    // *
    // */
    //get value(): number{
    //    return this._value;
    //}


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 读当前风机设备事件" +"。";
        }
        return "设备[id=" + this.id + "] 读当前风机设备事件" +"。";
    }
}

/**
 * 时间表开机事件
 */
export class ScheduleBootEvent extends FanCoilEvent {

    constructor(builder: ScheduleBootEventBuilder){
        super(builder);
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 时间表开机" +"。";
        }
        return "设备[id=" + this.id + "] 时间表开机" +"。";
    }
}

/**
 * 时间表关机事件
 */
export class ScheduleOffEvent extends FanCoilEvent {

    constructor(builder: ScheduleOffEventBuilder){
        super(builder);
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 时间表关机" +"。";
        }
        return "设备[id=" + this.id + "] 时间表关机" +"。";
    }
}

/**
 * 阈值开机事件
 */
export class ThresholdAutoBootEvent extends FanCoilEvent {

    constructor(builder: ThresholdAutoBootEventBuilder){
        super(builder);
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 阈值开机" +"。";
        }
        return "设备[id=" + this.id + "] 阈值开机" +"。";
    }
}

/**
 * 阈值关机事件
 */
export class ThresholdAutoOffEvent extends FanCoilEvent {

    constructor(builder: ThresholdAutoOffEventBuilder){
        super(builder);
    }


    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 阈值关机" +"。";
        }
        return "设备[id=" + this.id + "] 阈值关机" +"。";
    }
}


/**
 * 风机盘管构建器
 */
export abstract class FanCoilEventBuilder extends DeviceBasisEvents.DeviceEventBuilder {

    constructor(){
        super();
    }

}
/**
 * 读当前风机设备事件
 */
export class ReadFanEventBuilder extends FanCoilEventBuilder {

    // @ts-ignore
    //private _value: number;

    constructor(){
        super();
    }

    ///**
    // *
    // */
    //get value(): number{
    //    return this._value;
    //}
    //
    ///**
    // *
    // * @param value 电表值
    // */
    //withValue(value: number){
    //    this._value = value;
    //    return this;
    //}

    build(): ReadFanEvent{
        return new ReadFanEvent(this);
    }
}

/**
 *  时间表开机事件
 */
export class ScheduleBootEventBuilder extends FanCoilEventBuilder {


    constructor(){
        super();
    }


    build(): ScheduleBootEvent{
        return new ScheduleBootEvent(this);
    }
}

/**
 *  时间表关机事件
 */
export class ScheduleOffEventBuilder extends FanCoilEventBuilder {


    constructor(){
        super();
    }


    build(): ScheduleOffEvent{
        return new ScheduleOffEvent(this);
    }
}
/**
 *  阈值开机事件
 */
export class ThresholdAutoBootEventBuilder extends FanCoilEventBuilder {


    constructor(){
        super();
    }


    build(): ThresholdAutoBootEvent{
        return new ThresholdAutoBootEvent(this);
    }
}
/**
 *  阈值关机事件
 */
export class ThresholdAutoOffEventBuilder extends FanCoilEventBuilder {


    constructor(){
        super();
    }


    build(): ThresholdAutoOffEvent{
        return new ThresholdAutoOffEvent(this);
    }
}

/**
 * 风机设备事件转换器
 */
export class FanCoilEventTransformer implements IEventTransformer<FanCoilEvent> {

    tranformTo(event: FanCoilEvent): Object[] {
        let result = new Array<Object>();

        result.push(DEVICE_FanCoil_TRANSFORMER_NAME);
        if (event instanceof ReadFanEvent){
            result.push(1);
            this.tranformReadEvent(event, result);
        }
        if (event instanceof ScheduleBootEvent){
            result.push(2);
            this.tranformScheduleBootEvent(event, result);
        }
        if (event instanceof ScheduleOffEvent){
            result.push(3);
            this.tranformScheduleOffEvent(event, result);
        }
        if (event instanceof ThresholdAutoBootEvent){
            result.push(4);
            this.tranformThresholdBootEvent(event, result);
        }
        if (event instanceof ThresholdAutoOffEvent){
            result.push(5);
            this.tranformThresholdffEvent(event, result);
        }
        return result;

    }

    parseFrom(obj: Object[]): FanCoilEvent {
        let type = obj[1];
        let result = null;
        switch (type){
        case 1: {
            result = this.parseToReadEvent(obj);
            break;
        }
        case 2: {
            result = this.parseToScheduleBootEvent(obj);
            break;
        }
        case 3: {
            result = this.parseToScheduleOffEvent(obj);
            break;
        }
        case 4: {
            result = this.parseToThresholdBootEvent(obj);
            break;
        }
        case 5: {
            result = this.parseToThresholdOffEvent(obj);
            break;
        }

        }

        // @ts-ignore
        return result;
    }

    /**
     * 转换读当前风机设备事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformReadEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
        //result.push(event.value);
    }
    /**
     * 转换时间表开机事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformScheduleBootEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
    }
    /**
     * 转换时间表关机事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformScheduleOffEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
    }
    /**
     * 转换阈值开机事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformThresholdBootEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
    }
    /**
     * 转换阈值关机事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformThresholdffEvent( event: any, result: Array<Object>): void{
        //按次序处理
        result.push (event.id);
    }

    /**
     * 解析数组为读当前风机设备事件
     * @param obj  数组
     */
    parseToReadEvent(obj: Object[]) : ReadFanEvent {
        let builder = new ReadFanEventBuilder();
        builder.withId(obj[2].toString());
        //builder.withValue((Number)(obj[3]));

        return builder.build();
    }
    /**
     * 解析数组为时间表开机事件
     * @param obj  数组
     */
    parseToScheduleBootEvent(obj: Object[]) : ScheduleBootEvent {
        let builder = new ScheduleBootEventBuilder();
        builder.withId(obj[2].toString());

        return builder.build();
    }
    /**
     * 解析数组为时间表关机事件
     * @param obj  数组
     */
    parseToScheduleOffEvent(obj: Object[]) : ScheduleOffEvent {
        let builder = new ScheduleOffEventBuilder();
        builder.withId(obj[2].toString());

        return builder.build();
    }
    /**
     * 解析数组为阈值开机事件
     * @param obj  数组
     */
    parseToThresholdBootEvent(obj: Object[]) : ThresholdAutoBootEvent {
        let builder = new ThresholdAutoBootEventBuilder();
        builder.withId(obj[2].toString());

        return builder.build();
    }
    /**
     * 解析数组为阈值关机事件
     * @param obj  数组
     */
    parseToThresholdOffEvent(obj: Object[]) : ThresholdAutoOffEvent {
        let builder = new ThresholdAutoOffEventBuilder();
        builder.withId(obj[2].toString());

        return builder.build();
    }
}

}
