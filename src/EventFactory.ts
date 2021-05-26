import {IbmsEvent, IEventTransformer} from "./libs/event/Event";
import {isNull} from "./libs/event/Util";
//事件-----------------
import {WaterChangedEvent,WaterChangedEventBuilder} from './libs/device/event/WaterMetersEvent';
import {
    DeviceEvent, DeviceEventBuilder,
    DeviceProducedEvent, DeviceProducedEventBuilder,
    DeviceMaintenancedEvent, DeviceMaintenancedEventBuilder,
    DeviceAlarmEvent, DeviceAlarmEventBuilder,
    DeviceInstalledEventBuilder, DeviceUninstalledEventBuilder
} from './libs/event/DeviceEvent';

export interface IEventFactory<T extends IbmsEvent> {

    /**
     * 根据json创建对应的事件
     * @param json
     */
    createEvent(json: object): T;
}

// @ts-ignore
export class IWebSocketEvent implements IEventFactory{
    private readonly _eventFactoryMap: Map<string, any>;
    private readonly _eventName: string;
    private readonly _transformerName: string;
    private _EventBuilder: DeviceEventBuilder;
    private _Event: DeviceEvent;

    constructor(name:string){
        this._eventFactoryMap = new Map<string, IEventTransformer<IbmsEvent>>();
        this._eventName = isNull(name, "\"name\" cannot be null.");
        this._transformerName = isNull(name, "\"name\" cannot be null.");
    }

    //转换器工厂名 ----对应转换器
    createEvent(json:object){
        //this._eventFactoryMap.set( this._eventName,json);
        switch (this._eventName) {
            case 'DeviceInstalledEvent':
                this._EventBuilder=new DeviceInstalledEventBuilder();
                // 安装
                // @ts-ignore
                this._EventBuilder.withManufacturer("广州市晟能电子科技有限公司");
                // @ts-ignore
                this._EventBuilder.withModel("SN-DH266666666 温度计");
                // @ts-ignore
                this._EventBuilder.withCategory("温度计");
                // @ts-ignore
                this._EventBuilder.withSubsystem("webservice_dahua");
                // @ts-ignore
                this._EventBuilder.withFactoryName("temperature.sensor");
                // @ts-ignore
                this._EventBuilder.withFunctionalAreaId("HPDXXZ0101");
                // @ts-ignore
                this._EventBuilder.withPositionId("Test_position001");
                break;
            case 'DeviceProductEvent':
                this._EventBuilder = new DeviceProducedEventBuilder();
                break;
            case 'DeviceMaintenancedEvent':
                this._EventBuilder = new DeviceMaintenancedEventBuilder();
                break
            case 'DeviceAlarmEvent':
                this._EventBuilder = new DeviceAlarmEventBuilder();
                // @ts-ignore
                this._EventBuilder.withCategory("水温");
                // @ts-ignore
                this._EventBuilder.withMessage('温度超过30');
                // @ts-ignore
                this._EventBuilder.withTimeToLive(1000);
                break;
            case 'DeviceUninstalledEvent':
                //withSubsystem
                this._EventBuilder=new DeviceUninstalledEventBuilder();
                // @ts-ignore
                this._EventBuilder.withSubsystem("webservice_dahua");
                break;
            case 'WaterChangedEvent':
                this._EventBuilder=new WaterChangedEventBuilder();
                // @ts-ignore
                this._EventBuilder.withValue(json.value);
                break;
            default:
                this._Event=null;
                break
        }
        if(this._Event===null) return this._Event;


        // @ts-ignore
        this._EventBuilder.withId(json.deviceId);
        // @ts-ignore
        this._Event =  this._EventBuilder.build();

        // @ts-ignore
        this.addEvent(this._eventName ,this._Event);
        return this._Event;
    };
    addEvent(name:string,Event:IbmsEvent){
        if(name in Event) return;
        this._eventFactoryMap.set( name,Event);
    }
}

/**
 * 事件工厂资源库
 */
export class EventFactoryRepository {
    private readonly _factoryMap: Map<string, IEventFactory<IbmsEvent>>;

    constructor(){
        this._factoryMap = new Map<string, IEventFactory<IbmsEvent>>();
    }

    /**
     * 创建事件
     * @param name 事件工厂名称
     * @param json  json对象
     */
    createEvent(name: string, json: object): IbmsEvent{
        let factory = this._factoryMap.get( name );
        if (factory){
            return factory.createEvent(json);
        }
        let factorys = new IWebSocketEvent(name);
        this.addEventFactroy( new Set(name) ,factorys);
        return factorys.createEvent(json);
    }

    /**
     * 添加事件工厂
     * @param name  工厂名称
     * @param factory  工厂实例
     */
    addEventFactroy(names: Set<string>, factory: IEventFactory<IbmsEvent>){
        if (factory){
            if (names){
                for (let name of names){
                    this._factoryMap.set(name, factory);
                }
            }
        }
    }

    /**
     * 删除事件工厂
     * @param factory 事件工厂
     */
    removeEventFactory(factory: IEventFactory<IbmsEvent>){
        if (factory){
            let founds = new Array<string>();

            this._factoryMap.forEach( ( value, key) => {
                if (value === factory){
                    founds.push(key);
                }
            });

            for (let name of founds){
                this._factoryMap.delete(name);
            }
        }


    }
}
