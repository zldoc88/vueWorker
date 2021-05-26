
import { EventTransformerRepository, IbmsEvent, IEventListener } from "./libs/event/Event";
import { isNull } from "./libs/event/Util";

/**
 * 监听事件，并向javascript引擎线程同步事件。
 */
export class EventSyncListener implements IEventListener {

    private _transformerRepo: EventTransformerRepository;
    private _targetOrigin: any;

    constructor(transformerRepo: EventTransformerRepository){
        this._transformerRepo = isNull(transformerRepo, "\"transformerRepo\" cannot be null.");
        this._targetOrigin = new Array<ArrayBuffer>();
    }

    /**
     * 事件处理
     * @param event 事件 
     */
    onIbmsEvent(event: IbmsEvent): void {

        console.log('worker::事件处理=>event=====>',event);
        let arr = this._transformerRepo.tranformTo(event);
        console.log('worker::事件处理=>onIbmsEvent=====>',arr);
        if (arr){
                if (self.Worker){
                    // @ts-ignore
                    self.postMessage(arr);
                }
        }

    }

}