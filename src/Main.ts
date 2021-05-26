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
    console.log('event=>',event);
    // @ts-ignore
    if (event.data instanceof Array) {

        console.log('onMessage 收到事件：'+event);
        console.log(event);
        // @ts-ignore
        console.dir(event.data);
        // @ts-expect-error
        let ibmsEvent = context.transformers.paseeFrom(event.data);

        // 切换功能区事件
        if (ibmsEvent instanceof SwitchRegionEvent) {
             context.switchRegion('HPDXXZ0101');
            //context.switchRegion(ibmsEvent.regionId);
        }
    }
}
