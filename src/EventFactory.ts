import {IbmsEvent, IEventTransformer} from "./libs/event/Event";
import {isNull} from "./libs/event/Util";
//事件-----------------
import { TemperatureBasisEvents } from './libs/device/event/TemperatureEvent';
import { SwitchBasisEvents } from './libs/device/event/SwitchEvent';
import { GasMeterBasisEvents } from './libs/device/event/GasMeterEvent';
import { FanLosedPresetBasisEvents } from './libs/device/event/FanLosedPresetSettedEvent';
import { ElectricityBasisEvents } from './libs/device/event/ElectricityMeterEvent';
import { StateBasisEvents } from './libs/device/event/DeviceStateEvent';
import { DampnessBasisEvents } from './libs/device/event/DampnessEvent';
import { DeviceOnlineTimeBasisEvents } from './libs/device/event/TimeChangedEvent';
import { WaterBasisEvents } from './libs/device/event/WaterMetersEvent';
import { DeviceBasisEvents } from './libs/event/DeviceEvent';



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
    private _EventBuilder: any;
    private _Event: any;
    private _BuilderList: Array<any>=[];


    constructor(name:string){
        this._eventFactoryMap = new Map<string, IEventTransformer<IbmsEvent>>();
        this._eventName = isNull(name, "\"name\" cannot be null.");
        this._transformerName = isNull(name, "\"name\" cannot be null.");
        this._BuilderList=[
            DeviceBasisEvents,
            WaterBasisEvents,
            DeviceOnlineTimeBasisEvents,
            DampnessBasisEvents,
            StateBasisEvents,
            ElectricityBasisEvents,
            FanLosedPresetBasisEvents,
            GasMeterBasisEvents,
            SwitchBasisEvents,
            TemperatureBasisEvents,
        ];
    }
    private firstUpperCase (strings:string){
        return strings.replace(/\b(\w)(\w*)/g, ($0, $1, $2)=> {
            return $1.toUpperCase() + $2;
        });
    }

    //获取builder 类
    private getBuilderClass(){
        let _EventBuilder:any=null;
        //todo@修改------------------ //卸载、安装、维保、预警、设备子系统事件
        try {
            let isError=0;
            this._BuilderList.forEach(item=>{
                try {
                    if(_EventBuilder===null){
                        _EventBuilder=new (<any>item)[`${ this._eventName}Builder` ]();
                        isError=1;//异常不赋值
                    }
                }catch (e) {isError=2};
                if(isError===1) throw new Error('finded!');
            });
        }catch (e) {};
        return _EventBuilder;
    }

    // @ts-ignore 设置构建类的属性值
    private setActiveClassParams(json:object){
        // @ts-ignore
        this._EventBuilder.withId(json.deviceId);
        for(let item in json){
            if(item === 'deviceId') continue;
            try {// @ts-ignore
                this._EventBuilder[`with${this.firstUpperCase(item)}`](json[item]);
            }catch (e) {}
        }
    }
    //转换器工厂名 ----对应转换器
    createEvent(json:object){

        //获取对应类型 EnventBuilder------------
        this._EventBuilder = this.getBuilderClass();
        if( this._EventBuilder === null){
            return this._Event;
        }
        //设置构建类的属性值
        this.setActiveClassParams(json);

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
