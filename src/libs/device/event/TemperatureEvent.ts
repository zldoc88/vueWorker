import { isNull } from '../../event/Util';
import {
    DeviceBasisEvents
    /*DeviceEvent,
    DeviceEventBuilder,*/
} from '../../event/DeviceEvent';
import {
    IEventTransformer
} from '../../event/Event'

export module TemperatureBasisEvents{

/********************************
 ********            常量          ************
 * *********************************/

    // 设备温度事件转换器名称， 针对设备温度改变、已重置事件
export const  DEVICE_TEMPERATURE_TRANSFORMER_NAME = "device.temperature.transformer";

/**
 * 温度事件
 */
export abstract class TemperatureEvent extends DeviceBasisEvents.DeviceEvent {

    constructor(builder: TemperatureEventBuilder){
        super(builder);

    }

    get transformerName(){
        return DEVICE_TEMPERATURE_TRANSFORMER_NAME;
    }
}

/**
 * 温度改变事件
 */
export class TemperatureChangedEvent extends TemperatureEvent {
    private readonly _value: number;

    constructor(builder: TemperatureChangedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }
    /**
     * 温度值
     */
    get value(): number{
        return this._value;
    }
    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 温度改变为" + this._value +"°C";
        }
        return "设备[id=" + this.id + "] 温度改变为" + this._value +"°C";
    }
}

/**
 * 温度控制已重置事件
 */
export class TemperatureSettedEvent extends TemperatureEvent {

    private readonly _value: number;
    constructor(builder: TemperatureSettedEventBuilder){
        super(builder);
        this._value = isNull(builder.value, "\"value\" cannot be null.");
    }
    /**
     * 温度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 温度已重置为" + this._value +"°C";
        }
        return "设备[id=" + this.id + "] 温度已重置为" + this._value +"°C";
    }
}


/**
 * 温度事件转换器
 */


export class TemperatureToArrayEventTransformer implements IEventTransformer<TemperatureEvent> {

    tranformTo( event: TemperatureEvent ): Object[] {
        let result = new Array<Object>();

        result.push( DEVICE_TEMPERATURE_TRANSFORMER_NAME );
        if( event instanceof TemperatureChangedEvent ){
            result.push( 1 );
            this.tranformChangedEvent( event, result );
        }
        if( event instanceof TemperatureSettedEvent ){
            result.push( 2 );
            this.tranformSettedEvent( event, result );
        }
        return result;

    }

    parseFrom( obj: Object[] ): TemperatureEvent {
        let type = obj[ 1 ];
        let result = null;
        switch( type ){
            case 1:{
                result = this.parseToChangedEvent( obj );
                break;
            }
            case 2:{
                result = this.parseToSettedEvent( obj );
                break;
            }
        }
        // @ts-ignore
        return result;
    }

    /**
     * 转换温度改变事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformChangedEvent( event: TemperatureChangedEvent, result: Array<Object> ): void {
        //按次序处理
        result.push( event.id );
        result.push( event.value );
    }
    /**
     * 转换温度已重置事件
     * @param event  事件
     * @param result  返回的数组
     */
    tranformSettedEvent( event: TemperatureSettedEvent, result: Array<Object> ): void {
        //按次序处理
        result.push( event.id );
        result.push( event.value );
    }

    /**
     * 解析数组为温度改变事件
     * @param obj  数组
     */
    parseToChangedEvent( obj: Object[] ): TemperatureChangedEvent {
        let builder = new TemperatureChangedEventBuilder();
        builder.withId( obj[ 2 ].toString() );
        builder.withValue( ( Number )( obj[ 3 ] ) );
        return builder.build();

    }
    /**
     * 解析数组为温度已重置事件
     * @param obj  数组
     */
    parseToSettedEvent( obj: Object[] ): TemperatureSettedEvent {
        let builder = new TemperatureSettedEventBuilder();
        builder.withId( obj[ 2 ].toString() );
        builder.withValue( ( Number )( obj[ 3 ] ) );
        return builder.build();
    }

}


/**
 * 温度事件构建器
 */
export abstract class TemperatureEventBuilder extends DeviceBasisEvents.DeviceEventBuilder {

    constructor(){
        super();
    }

}

/**
 * 温度改变事件
 */
export class TemperatureChangedEventBuilder extends TemperatureEventBuilder {

    // @ts-ignore
    private _value: number;
    constructor(){
        super();
    }
    /**
     * 温度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置温度值
     * @param value 温度值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }
    build(): TemperatureChangedEvent{
        return new TemperatureChangedEvent(this);
    }
}

/**
 * 温度已重置事件
 */
export class TemperatureSettedEventBuilder extends TemperatureEventBuilder {

    // @ts-ignore
    private _value: number;
    constructor(){
        super();
    }
    /**
     * 温度值
     */
    get value(): number{
        return this._value;
    }

    /**
     * 设置温度值
     * @param value 温度值
     */
    withValue(value: number){
        this._value = value;
        return this;
    }
    build(): TemperatureSettedEvent{
        return new TemperatureSettedEvent(this);
    }
}
}