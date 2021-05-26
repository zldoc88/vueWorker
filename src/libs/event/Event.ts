/**
 * Ibms消息
 */
export abstract class IbmsEvent {
    constructor(){
  
    }
  
    /**
     * 事件的描述消息
     * @param source 事件源的名称，可能为null.
     */
    abstract getMessage(source: string): string;
  
    /**
     * 对应转换器名称
     */
    abstract get transformerName(): string;
  }
  
  /**
   * 事件转换器，提供将数组转换为事件的方法
   */
  export interface IEventTransformer<E extends IbmsEvent> {
  
    /**
     * 将event转换为T
     * @param event
     */
    tranformTo(event: E): Object[];
  
    /**
     * 解析obj为事件。
     * 本方法和IbmsEvent的toArray方法相对应
     */
    parseFrom(obj: Object[]): E;
  }
  
  /**
   * 事件监听器
   */
  export interface IEventListener {
  
    /**
     * 事件处理
     * @param event
     */
    onIbmsEvent(event: IbmsEvent):void;
  }
  
  /**
   * 事件转换器资源库
   */
  export  class EventTransformerRepository  {
    private readonly _transformerMap: Map<string, IEventTransformer<IbmsEvent>>;
  
    constructor(){
      this._transformerMap = new Map<string, IEventTransformer<IbmsEvent>>();
    }
  
    /**
     * 将event转换为T
     * @param event
     */
    tranformTo(event: IbmsEvent): object[]{
      if (event){
        let name = event.transformerName;
        if (name){
          let transformer = this._transformerMap.get(name);
          if (transformer){
            return transformer.tranformTo(event);
          }else{
            throw Error("cannot transform processing, because transformer not exists.");
          }
        }else{
          throw Error("cannot transform processing, because event typeName is be null..");
        }
      }
  
      throw Error("cannot transform processing, because event is null.");
    }
  
    /**
     * 解析obj为事件
     * @param obj  被解析对象
     */
    paseeFrom(obj: object[]): IbmsEvent {
        console.log(obj);
      if (obj){
        let name = this.getEventTransformerName(obj);
        console.log(name);
        if (name){
          let transformer = this._transformerMap.get(name);
          console.log(transformer);
          if (transformer){
              console.log(transformer.parseFrom(obj));
            return transformer.parseFrom(obj);
          }else{
            throw Error("cannot transform processing, because transformer not exists:" + name);
          }
        }else{
          throw Error("cannot transform processing, because transformer's name is unknown..");
        }
      }
  
      throw Error("cannot parse processing, because obj is null.");
    }
  
    /**
     * 获取转换器名称
     */
    private getEventTransformerName(data: object[]): string{
      return data[0].toString();
    }
  
    /**
     * 添加事件监听器
     * @param name  转换器名称
     * @param transformer  事件转换器
     */
    addEventTransformer <E extends IbmsEvent>(name: string, transformer:IEventTransformer<E>) : void{
      if (name && transformer){
        this._transformerMap.set(name, transformer);
      }
    }
  
    /**
     * 按name移除事件转换器
     * @param name 转换器名称
     */
    removeEventTransformer(name: string): boolean{
      if (name){
        return this._transformerMap.delete(name);
      }
  
      return false;
    }
  }
  
  export interface IAlarmEvent {
  
    /**
     * 报警时长
     */
    getAlarmTime(): number;
  }
  
  /**
   * 判断事件是否为报警事件
   * @param event 事件
   * @returns 返回true表示是，否则返回false
   */
  
  // @ts-ignore
  function isAlarmEvent(event: IbmsEvent){
    return "getAlarmTime" in event;
  }
  
  
  
  
  
  