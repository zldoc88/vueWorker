import { isNull } from '../../event/Util';
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

    // 设备时长变化事件转换器名称， 针对设备在线时长发生变化、运行时长发生变化事件
export const  DEVICE_TIME_TRANSFORMER_NAME = "device.time.transformer";

/**
 * 时长发生变化事件
 */
export abstract class TimeChangedEvent extends DeviceEvent {

    constructor(builder: TimeChangedEventBuilder){
        super(builder);
    }

    get transformerName(){
        return DEVICE_TIME_TRANSFORMER_NAME;
    }
}

/**
 * 在线时长发生变化事件
 */
export class OnlineTimeChangedEvent extends TimeChangedEvent {

    private readonly _value: number;

    constructor(builder: OnlineTimeChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 在线时长变化值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 在线时长变化值为:" + this.value + ".";
        }
        return "设备[id=" + this.id + "] 在线时长变化值为:" + this.value + ".";
    }
}

/**
 * 运行时长发生变化事件
 */
export class RunningTimeChangedEvent extends TimeChangedEvent {

    private readonly _value: number;

    constructor(builder: RunningTimeChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }

    /**
     * 运行时长发生变化值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 运行时长变化值为:" + this.value + ".";
        }
        return "设备[id=" + this.id + "] 运行时长变化值为:" + this.value + ".";
    }
}


/**
 * 时长发生变化事件转换器
 */
export class TimeToArrayEventTransformer implements IEventTransformer<TimeChangedEvent> {

    tranformTo( event: TimeChangedEvent ): Object[] {
        let result = new Array<Object>();

        result.push( DEVICE_TIME_TRANSFORMER_NAME );
        if( event instanceof OnlineTimeChangedEvent ){
            result.push( 1 );
            this.tranformOnlineEvent( event, result );
        }
        else if( event instanceof RunningTimeChangedEvent ){
            result.push( 2 );
            this.tranformRunningEvent( event, result );
        }
        return result;

    }

    parseFrom( obj: Object[] ): TimeChangedEvent {
        let type = obj[ 1 ];
        let result = null;
        switch( type ){
        case 1:{
            result = this.parseToOnlineEvent( obj );
            break;
        }
        case 2:{
            result = this.parseToRunningEvent( obj );
            break;
        }
        }
        // @ts-ignore
        return result;
    }

    /**
     * 转换在线时长发生变化事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformOnlineEvent( event: OnlineTimeChangedEvent, result: Array<Object> ): void {
        //按次序处理
        result.push( event.id );
        result.push( event.value );
    }
    /**
     * 转换运行时长发生变化事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformRunningEvent( event: RunningTimeChangedEvent, result: Array<Object> ): void {
        //按次序处理
        result.push( event.id );
        result.push( event.value );
    }

    /**
     * 解析数组为在线时长发生变化事件
     * @param obj  数组
     */
    parseToOnlineEvent( obj: Object[] ): OnlineTimeChangedEvent {
        let builder = new OnlineTimeChangedEventBuilder();
        builder.withId( obj[ 2 ].toString() );
        builder.withValue( ( Number )( obj[ 3 ] ) );
        return builder.build();

    }
    /**
     * 解析数组为运行时长发生变化事件
     * @param obj  数组
     */
    parseToRunningEvent( obj: Object[] ): RunningTimeChangedEvent {
        let builder = new RunningTimeChangedEventBuilder();
        builder.withId( obj[ 2 ].toString() );
        builder.withValue( ( Number )( obj[ 3 ] ) );
        return builder.build();
    }

}


/**
 * 时长发生变化事件构建器
 */
export abstract class TimeChangedEventBuilder extends DeviceEventBuilder {

    constructor(){
        super();
    }

}

/**
 * 在线时长发生变化事件
 */
export class OnlineTimeChangedEventBuilder extends TimeChangedEventBuilder {
    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 时长发生变化值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置时长发生变化值
     * @param value 时长发生变化值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): OnlineTimeChangedEvent{
        return new OnlineTimeChangedEvent(this);
    }
}

/**
 * 运行时长发生变化事件
 */
export class RunningTimeChangedEventBuilder extends TimeChangedEventBuilder {
    // @ts-ignore
    private _value: number;

    constructor(){
        super();
    }

    /**
     * 运行时长变化值
     */
    get value(): number{
        return this._value;
    }

    /**
     * @param value 时长发生变化值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }

    build(): RunningTimeChangedEvent{
        return new RunningTimeChangedEvent(this);
    }
}
