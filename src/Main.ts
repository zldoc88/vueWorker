// work进程代码

import {SwitchRegionEvent} from "./libs/event/RegionEvent";
import {MockWebSocketClientFactory} from "./MockWebSocketFactroy";
import {WorkerContext} from "./WorkerContext";
import {ImportEvent} from "./ImportEvents";
import { REGION_TRANSFORMER_NAME, RegionEventTransformer} from './libs/event/RegionEvent';

let WebSocketURLDefault: string = `ws://192.168.1.164:8081/subscriptions`,
    protocolsDefault: string = 'graphql-ws';
// @ts-ignore
let factory = new MockWebSocketClientFactory(self.name || WebSocketURLDefault);
let context = new WorkerContext(factory);
// @ts-ignore
self.context = context;
// @ts-ignore
let workerContext = self.context;
ImportEvent(workerContext);

//
// context.switchRegion('HPDXXZ0101');

self.addEventListener("message", onMessage);

/**
 * 事件
 * @param event
 */

function onMessage(event : Object) {
    // @ts-ignore
    if (event.data instanceof Array) {
        // @ts-ignore
        let ibmsEvent = context.transformers.paseeFrom(event.data);
        // 切换功能区事件
        if (ibmsEvent instanceof SwitchRegionEvent) {
             //context.switchRegion('HPDXXZ0101');
            context.switchRegion(ibmsEvent.regionId);
            return;
        }

        if(workerContext.client){
           // console.log('workerContext.client',workerContext.client.WebSocket4Client);
            // @ts-ignore
            workerContext.client.WebSocket4Client.send( JSON.stringify( event.data ) );
        }



    }
}
