import {EventBus} from "./EventBus";
import {EventFactoryRepository} from "./EventFactory";
import {EventSyncListener} from "./EventSync";
import {EventTransformerRepository, IbmsEvent} from "./libs/event/Event";
import {IWebSocketClient, IWebSocketClientFactory} from "./WebSocketClient";

/**
 * 运行上下文
 */
export class WorkerContext { // @ts-ignore
    private _regionId : string;

    private readonly _transformerRepo : EventTransformerRepository;
    // @ts-ignore
    private readonly _client : IWebSocketClient;
    private readonly _eventBus : EventBus;
    private readonly _factoryRepo : EventFactoryRepository;

    // @ts-ignore
    constructor(factory : IWebSocketClientFactory) {
        this._transformerRepo = new EventTransformerRepository();
        this._eventBus = new EventBus();
        this._eventBus.addListener(new EventSyncListener(this._transformerRepo));

        this._factoryRepo = new EventFactoryRepository();
        // @ts-ignore
        this._client = factory.createWebSocketClient( (ins , event , data) =>{
            // this.onWebSocketEvent(ins , event , data)
        });
        this.vCreateEvent();
    }

    /**
     * 切换区域
     * @param regionId 区域编号
     */
    switchRegion(regionId : string) {
        //console.log(this._client);
        // 关闭已有连接
        // @ts-ignore
        if (this._client.connected) {
            this._client.close(regionId);
        }

        // 暂停100毫秒
        this.sleep(100);

        // 打开连接
        if (regionId) {
            this._client.open(regionId);
        }
    }

    /**
     * 转换器资源库
     * @returns EventTransformerRepository
     */
    get transformers(): EventTransformerRepository {
        return this._transformerRepo;
    }

    /**
     * 暂停
     */
    private sleep(d : number): void {
        for (var t = Date.now(); Date.now() - t <= d;) {

        }
    }

    //@todo 模拟事件=====================================================
    private vCreateEvent(){
        let vData=[
            {
                __typename:'IBMS_DeviceInstalledEvent',
                deviceId:'19990990',
                manufacturer:"广州市晟能电子科技有限公司",
                model:"SN-DH266666666 温度计",
                category:"温度计",
                subsystem:"webservice_dahua",
                factoryName:"temperature.sensor",
                functionalAreaId:"HPDXXZ0101",
                positionId:"Test_position001",
            },
            {
                __typename:'IBMS_DeviceProducedEvent',
                deviceId:'19990990',
            },
            {
                __typename:'IBMS_DeviceAlarmEvent',
                deviceId:'19990990',
                category:'水温',
                message:'温度超过30',
                timeToLife:1000,
            },
            {
                __typename:'IBMS_DeviceUninstalledEvent',
                deviceId:'19990990',
                subsystem:"webservice_dahua",
            },
            {
                __typename:'IBMS_WaterChangedEvent',
                deviceId:'19990990',
                value:22,
            },


        ];

        let  radom = 0;
        let _go=()=>{
            let data= {
                payload:{
                    data:{
                        AllDeviceEvents:vData[radom]
                    }
                },
            };
            let JSONStringify = JSON.stringify(data);
            //let json = JSON.stringify({type:name[radom],data:JSONStringify});
            let JsonData = JSON.parse('{}');
            this.onWebSocketEvent({},JsonData,JSONStringify);
            radom++;
            radom = radom>(vData.length -1)? 0:radom;
            setTimeout(_go,3000);
        };

        setTimeout(_go,3000);
    }
    /**
      *  WebSocket事件处理
      * @param event
      */
    // @ts-ignore this.ws4Client, event, event.data
    private onWebSocketEvent(ws4Client:any,event : JSON ,data:any) {
        // @ts-ignore
        let dt = JSON.parse(data);
        let message = dt?.payload?.data?.AllDeviceEvents;
        message = message =null ?{}:message;
        // @ts-ignore
        //self.postMessage(message);

        if(!message) return;
        let name = this.getEventName(message);
        let EventName = name.split('IBMS_')[1];
        if (EventName) {
            let ibmsEvent = this._factoryRepo.createEvent(EventName, message);
            if(ibmsEvent) this._eventBus.publishEvent(ibmsEvent);
        }
    }

    /**
      * 获取事件名称
      * @param event
      */
    private getEventName(event : any): string {
        if (event.hasOwnProperty('__typename')) {
            let remoteEvent: RemoteEvent = event;
            return remoteEvent.__typename;
        }

        // @ts-ignore
        return null;
    }
}

/**
 * 远程事件
 */
interface RemoteEvent {
    __typename: string;
}
