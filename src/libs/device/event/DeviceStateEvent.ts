/**
 * Project: ibms-worker
 * Author: SN-510S-A
 * Email: 2726893248@qq.com
 * CreateDate: 2020-12-18 11:41:24
 * IDE: WebStorm
 */

import {
    DeviceEvent,
    DeviceEventBuilder,
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

/********************************
 ********            常量          ************
 * *********************************/

    // 设备状态事件转换器名称， 针对设备启动、停止事件
export const  DEVICE_STATE_TRANSFORMER_NAME = "device.state.transformer";

/**
 * 设备状态事件
 */
export abstract class DeviceStateEvent extends DeviceEvent {

    constructor(builder: StateEventBuilder){
        super(builder);

    }
    get transformerName(){
        return DEVICE_STATE_TRANSFORMER_NAME;
    }
}

/**
 * 设备启动事件
 */
export class DeviceStartedEvent
    extends DeviceStateEvent {

    constructor(builder: DeviceStartedEventBuilder){
        super(builder);

    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 设备启动";
        }
        return "设备[id=" + this.id + "] 设备启动" ;
    }
}

/**
 * 设备准备停止事件
 */
export class DeviceStoppingEvent extends DeviceStateEvent {

    constructor(builder: DeviceStoppingEventBuilder){
        super(builder);

    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 设备准备停止";
        }
        return "设备[id=" + this.id + "] 设备准备停止" ;
    }
}

/**
 * 设备状态事件构建器
 */
export abstract class StateEventBuilder extends DeviceEventBuilder {

    constructor(){
        super();
    }
}

export class DeviceStartedEventBuilder extends StateEventBuilder{
    constructor(){
        super();
    }

    build(): DeviceStartedEvent{
        return new DeviceStartedEvent(this);
    }
}


export class DeviceStoppingEventBuilder extends StateEventBuilder{
    constructor(){
        super();
    }

    build(): DeviceStoppingEvent{
        return new DeviceStoppingEvent(this);
    }
}




/**
 * 设备状态事件转换器
 */
export class StateEventTransformer
    implements IEventTransformer<DeviceStateEvent> {
    /**
     * 将event转换为对象数组
     * @param event  事件
     */
    tranformTo( event: DeviceStateEvent ): Object[]{
        let result = new Array<Object>();
        result.push(DEVICE_STATE_TRANSFORMER_NAME);
        if (event instanceof DeviceStartedEvent){
            result.push(1);
            this.tranformStartEvent(event, result);
        }
        if (event instanceof DeviceStoppingEvent){
            result.push(2);
            this.tranformStopEvent(event, result);
        }
        return result;

    }

    /**
     * 将数组转换为事件
     * @param obj
     */
    parseFrom( obj: Object[] ): DeviceStateEvent{
        let type = obj[1];
        let result = null;
        switch (type){
        case 1: {
            result = this.parseToStartEvent(obj);
            break;
        }
        case 2: {
            result = this.parseToStopEvent(obj);
            break;
        }
        }

        // @ts-ignore
        return result;
    }
    /**
     * 转换设备开启事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformStartEvent( event: DeviceStartedEvent, result: Array<Object> ): void{
        result.push (event.id);
    }

    /**
     * 解析数组为设备开启事件
     * @param obj  数组
     */
    parseToStartEvent( obj: Object[] ): DeviceStartedEvent {
        let builder = new DeviceStartedEventBuilder();
        builder.withId(obj[2].toString());
        return builder.build();
    }


    /**
     * 转换设备停止事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformStopEvent( event: DeviceStoppingEvent, result: Array<Object> ): void{
        result.push (event.id);
    }

    /**
     * 解析数组为设备停止事件
     * @param obj  数组
     */
    parseToStopEvent( obj: Object[] ): DeviceStoppingEvent {
        let builder = new DeviceStoppingEventBuilder();
        builder.withId(obj[2].toString());
        return builder.build();
    }
}

