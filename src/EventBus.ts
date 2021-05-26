import { IbmsEvent, IEventListener } from "./libs/event/Event";

/**
 * 事件总线
 */
export class EventBus {

    private readonly _listeners: Set<IEventListener>;
 
 
     constructor(){
          this._listeners = new Set<IEventListener>();
     }
 
     /**
      * 发布事件
      */
     publishEvent(event: IbmsEvent): void{
       for (let listener of this._listeners){
           console.log('发布事件================>',listener,event);
           listener.onIbmsEvent(event);
       }
     }
 
     /**
      * 添加事件监听器
      * @param listener 事件监听器
      */
     addListener(listener: IEventListener):void{
       if (listener){
          this._listeners.add(listener);
       }
     }
 
     /**
      * 移除事件监听器
      * @param listener 事件监听器
      */
     removeListener(listener: IEventListener){
        if (listener){
           this._listeners.delete(listener);
        }
     }
  }
 