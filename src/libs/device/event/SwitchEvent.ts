
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

    // 设备开关事件转换器名称， 针对设备开关开启、关闭事件
export const DEVICE_SWITCH_TRANSFORMER_NAME = 'device.switch.transformer';

/**
 * 开关事件
 */
export abstract class SwitchEvent
    extends DeviceEvent {

    constructor( builder: SwitchEventBuilder ) {
        super( builder );
    }

    get transformerName() {
        return DEVICE_SWITCH_TRANSFORMER_NAME;
    }
}

/**
 * 开关开启事件
 */
export class OpenedEvent
    extends SwitchEvent {

    constructor( builder: OpenedEventBuilder ) {
        super( builder );

    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 开关开启";
        }
        return "设备[id=" + this.id + "] 开关开启" ;
    }
}

/**
 * 开关已关闭事件
 */
export class ClosedEvent
    extends SwitchEvent {

    constructor( builder: ClosedEventBuilder ) {
        super( builder );

    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 开关已关闭";
        }
        return "设备[id=" + this.id + "] 开关已关闭" ;
    }
}

export class SwitchEventTransformer
    implements IEventTransformer<SwitchEvent> {
    /**
     * 将event转换为对象数组
     * @param event  事件
     */
    tranformTo( event: SwitchEvent ): Object[]{
        let result = new Array<Object>();
        result.push(DEVICE_SWITCH_TRANSFORMER_NAME);
        if (event instanceof OpenedEvent){
            result.push(1);
            this.tranformOpenedEvent(event, result);
        }
        else if( event instanceof ClosedEvent){
            result.push(2);
            this.tranformClosedEvent(event, result);
        }
        return result;

    }

    /**
     * 将数组转换为事件
     * @param obj
     */
    parseFrom( obj: Object[] ): SwitchEvent{
        let type = obj[1];
        let result = null;
        switch (type){
        case 1: {
            result = this.parseToOpenedEvent(obj);
            break;
        }
        case 2: {
            result = this.parseToClosedEvent(obj);
            break;
        }
        }

        // @ts-ignore
        return result;
    }

    /**
     * 转换开关开启事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformOpenedEvent( event: OpenedEvent, result: Array<Object> ): void{
        result.push (event.id);
    }

    /**
     * 解析数组为开关开启事件
     * @param obj  数组
     */
    parseToOpenedEvent( obj: Object[] ): OpenedEvent {
        let builder = new OpenedEventBuilder();
        builder.withId(obj[2].toString());
        return builder.build();
    }

    /**
     * 转换开关已关闭事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformClosedEvent( event: ClosedEvent, result: Array<Object> ): void{
        result.push (event.id);
    }

    /**
     * 解析数组为开关已关闭事件
     * @param obj  数组
     */
    parseToClosedEvent( obj: Object[] ): ClosedEvent {
        let builder = new ClosedEventBuilder();
        builder.withId(obj[2].toString());
        return builder.build();
    }
}

/**
 * 开关事件构建器
 */
export abstract class SwitchEventBuilder
    extends DeviceEventBuilder {

    constructor() {
        super();
    }

}

/**
 * 开关开启事件
 */
export class OpenedEventBuilder
    extends SwitchEventBuilder {

    constructor() {
        super();
    }

    build(): OpenedEvent {
        return new OpenedEvent( this );
    }
}

/**
 * 开关已关闭事件
 */
export class ClosedEventBuilder
    extends SwitchEventBuilder {

    constructor() {
        super();
    }

    build(): ClosedEvent {
        return new ClosedEvent( this );
    }
}
