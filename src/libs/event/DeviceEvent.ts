import {
  IbmsEvent,
  IEventTransformer
} from './Event';
import { isNull } from './Util';

export module DeviceBasisEvents{
/**
* 抽象的设备事件
*/
export abstract class DeviceEvent extends IbmsEvent {
  private readonly _id: string;

  constructor(builder: DeviceEventBuilder) {
      super();
      this._id = isNull(builder.id, '"id" cannot be null.');
  }

  get id(): string {
      return this._id;
  }
}

/**
* 设备事件构建器，抽象类
*/
export abstract class DeviceEventBuilder {
  // @ts-ignore
  private _id: string;

  constructor() {}

  /**
   * 编号
   */
  get id(): string {
      return this._id;
  }

  /**
   * 设置设备编号
   * @param value
   */
  withId(value: string): DeviceEventBuilder {
      this._id = value;
      return this;
  }

}


// 设备生命周期事件转换器名称， 针对设备安装(检测)，投产，维保，卸载事件
export const DEVICE_LIFECYCLE_TRANSFORMER_NAME = "device.lifecycle.transformer";

/**
* 抽象的设备生命周期改变事件
*/
export abstract class DeviceLifecycleChangedEvent extends DeviceEvent {


  constructor(builder: DeviceLifecycleChangedEventBuilder) {
      super(builder);
  }

  /**
   * 事件转换器名称
   */
  get transformerName(): string {
      return DEVICE_LIFECYCLE_TRANSFORMER_NAME;
  }
}

/**
* 设备安装事件
*/
export class DeviceInstalledEvent extends DeviceLifecycleChangedEvent {
  private readonly _manufacturer: string;
  private readonly _model: string;
  private readonly _category: string;
  private readonly _subsystemName: string;
  private readonly _functionalAreaId: string;
  private readonly _positionId: string;
  private readonly _factoryName: string;

  constructor(builder: DeviceInstalledEventBuilder) {
      super(builder);
      this._manufacturer = isNull(builder.manufacturer, '"manufacturer" cannot be null.');
      this._model = isNull(builder.model, '"model" cannot be null.');
      this._category = isNull(builder.category, "\"category\" cannot be null.");
      this._subsystemName = isNull(builder.subsystemName, '"subsystemName" cannot be null.');
      this._functionalAreaId = isNull(builder.functionalAreaId, "\"_functionalAreaId\" cannot be null.");
      this._factoryName = isNull(builder.factoryName, "\"factoryName\" cannot be null.");
      this._positionId = builder.positionId;
  }

  /**
   * 厂家
   */
  get manufacturer(): string {
      return this._manufacturer;
  }

  /**
   * 型号
   */
  get model(): string {
      return this._model;
  }

  get category(): string{
      return this._category;
  }

  /**
   * 所属于设备子系统名称
   */
  get subsystemName(): string {
      return this._subsystemName;
  }

  /**
   * 所在功能区编号
   */
  get functionalAreaId(): string{
      return this._functionalAreaId;
  }

  /**
   * 所在点位编号
   */
  get positionId(): string{
      return this._positionId;
  }

  /**
   * 设备工厂名称
   */
  get factoryName(): string{
      return this._factoryName;
  }


  /**
   * 事件消息
   */
  getMessage(source: string): string {
      if (source){
          return source + "[id=" + this.id + "] 已经安装.";
      }
      return this.category + "[id=" + this.id + "] 已经安装.";
  }
}

/**
* 设备已进入投产事件
*/
export class DeviceProducedEvent extends DeviceLifecycleChangedEvent {
  constructor(builder: DeviceProducedEventBuilder) {
      super(builder);
  }


  /**
   * 事件消息
   */
  getMessage(source: string): string {
      if (source){
          return source + "[id=" + this.id + "] 已经投产.";
      }

      return "设备[id=" + this.id + "] 已经投产.";
  }
}

/**
* 设备已进入维保阶段事件
*/
export class DeviceMaintenancedEvent extends DeviceLifecycleChangedEvent {
  constructor(builder: DeviceLifecycleChangedEventBuilder) {
      super(builder);
  }

  /**
   * 事件消息
   */
  getMessage(source: string): string {
      if (source){
          return source +  "[id=" + this.id + "] 已经进入维保.";
      }
      return  "设备[id=" + this.id + "] 已经进入维保.";
  }
}

/**
* 设备卸载事件
*/
export class DeviceUninstalledEvent extends DeviceLifecycleChangedEvent {
  private readonly _subsystemName: string;

  constructor(builder: DeviceUninstalledEventBuilder) {
      super(builder);
      this._subsystemName = isNull(builder.subsystemName, '"subsystemName" cannot be null.');
  }

  /**
   * 子系统名称
   */
  get subsystemName(): string {
      return this._subsystemName;
  }

  getMessage(source: string): string {
      if (source){
          return source + "[id=" + this.id + "] 已经卸载.";
      }
      return  "设备[id=" + this.id + "] 已经卸载.";
  }
}

/**
* 设备绑定点位事件
*/
export class DeviceBindedPositionEvent  extends DeviceEvent {

  private readonly _functionalAreaId: string;
  private readonly _positionId: string;

  constructor(builder: DeviceBindedPositionEventBuilder){
      super(builder);
      this._functionalAreaId = isNull(builder.functionalAreaId, "\"functionalAreaId\" cannot be null.");
      this._positionId = isNull(builder.positionId, "\"positionId\" cannot be null.");
  }

  /**
   * 功能区编号
   */
  get functionalAreaId(): string{
      return this._functionalAreaId;
  }

  /**
   * 点位编号
   */
  get positionId(): string{
      return this._positionId;
  }

  getMessage(source: string): string {
      if (source){
          return source + "[id=" + this.id + "]绑定安装点位";
      }

      return "设备[id=" + this.id + "]绑定安装点位";
  }

  get transformerName(): string {
      return DEVICE_LIFECYCLE_TRANSFORMER_NAME;
  }

}

/**
 * 设备预警事件
 */
export class DeviceAlarmEvent extends DeviceLifecycleChangedEvent {

    private _message: String = '';
    private _category: String = '';
    private _timeToLife: number = 0;

    constructor(builder: DeviceAlarmEventBuilder) {
        super(builder);
        this._message = isNull(builder.message, "\"message\" cannot be null.");
        this._category = isNull(builder.category, "\"category\" cannot be null.");
        // @ts-ignore
        this._timeToLife = isNull(builder.timeToLife, "\"timeToLife\" cannot be null.");
    }

    get category(): String{
        return this._category;
    }

    get message(): String{
        return this._message;
    }

    get timeToLife(): Number{
        return this._timeToLife;
    }

    /**
     * 消息
     */
    getMessage(source: string): string{
        if (source){
            return source +  "[id=" + this.id + "] 设备预警为" + this._message;
        }
        return "设备[id=" + this.id + "] 设备预警为" + this._message;
    }
}

/**
* 通用的事件转化器
* 包括： 设备安装(检测)，设备投产，设备维保。
*/
export class DeviceLifecycleEventTransformer
  implements IEventTransformer<DeviceEvent> {
  /**
   * 将event转换为对象数组
   * @param event  事件
   */
  tranformTo(event: DeviceEvent): Object[] {
      let result = new Array<Object>();

      //第一步，设置事件转换器名称
      result.push(DEVICE_LIFECYCLE_TRANSFORMER_NAME);
      if (event instanceof DeviceInstalledEvent) {
          // 0: 表示为设备已及入安装事件
          result.push(0);
          this.transformWIthInstalledEvent(event, result);
          return result;
      }

      if (event instanceof DeviceProducedEvent) {
          //1: 表示设备已进入投产阶段
          result.push(1);
          this.transformWithProducedEvent(event, result);
          return result;
      }

      if (event instanceof DeviceMaintenancedEvent) {
          //1: 表示设备已进入维保阶段
          result.push(2);
          this.transformWithMaintenancedEvent(event, result);
          return result;
      }

      if (event instanceof DeviceAlarmEvent) {
          //1: 表示设备已进入维保阶段
          result.push(4);
          this.transformWithDeviceAlarmEvent(event, result);
          return result;
      }

      if (event instanceof DeviceUninstalledEvent) {
          result.push(3);
          this.transformWithUninstalledEvent(event, result);
          return result;
      }

      if (event instanceof DeviceBindedPositionEvent){
          result.push(10);
          this.transformWIthBindedPosition(event, result);
          return result;
      }

      throw new Error("transformer  failed: unknown event.");
  }

  /**
   * 将数组转换为事件
   * @param obj
   */
  parseFrom(obj: Object[]): DeviceEvent {
      // @ts-ignore
      if (!obj) return null;

      let type = obj[1];
      // @ts-ignore
      let result: DeviceEvent = null;

      switch (type) {
      case 0:
          result = this.parseToInstalledEvent(obj).build();
          break;

      case 1:
          result = this.parseToProducedEvent(obj).build();
          break;

      case 2:
          result = this.parseToMaintenancedEvent(obj).build();
          break;

      case 3:
          result = this.parseToUninstalledEvent(obj).build();
          break;
      case 4:
          result = this.parseToDeviceAlarmEvent(obj).build();
          break;

      case 10:
          result = this.parseToBindedPositionEvent(obj).build();
          break;

      default:
          break;
      }

      if (result) {
          return result;
      } else {
          throw new Error("parse event failed: unknown event type.");
      }
  }

  /**
   * 转换设备已安装事件
   * @param event  设备已安装事件
   * @param result  返回的数组
   */
  protected transformWIthInstalledEvent(event: DeviceInstalledEvent, result: Array<Object>): void {
      //依次压入事件属性
      result.push(event.id);
      result.push(event.category);
      result.push(event.manufacturer);
      result.push(event.model);
      result.push(event.subsystemName);
      result.push(event.functionalAreaId);
      result.push(event.positionId);
      result.push(event.factoryName);
  }

  /**
   * 转换设备已投产事件
   * @param event
   * @param result
   */
  protected transformWithProducedEvent(event: DeviceProducedEvent, result: Array<Object>) {
      //依次压入事件属性
      result.push(event.id);
  }

  /**
   * 转换设备已进入维保事件
   * @param event
   * @param result
   */
  protected transformWithMaintenancedEvent(event: DeviceMaintenancedEvent, result: Array<Object>) {
      //依次压入事件属性
      result.push(event.id);
  }

  /**
   * 转换设备已进入维保事件
   * @param event
   * @param result
   */
  protected transformWithUninstalledEvent(event: DeviceUninstalledEvent, result: Array<Object>) {
      //依次压入事件属性
      result.push(event.id);
      result.push(event.subsystemName);
  }
  /**
   * 转换设备已进入维保事件
   * @param event
   * @param result
   */
  protected transformWithDeviceAlarmEvent(event: DeviceAlarmEvent, result: Array<Object>) {
      //依次压入事件属性
      result.push(event.id);
      // @ts-ignore
      result.push(event.category);
      // @ts-ignore
      result.push(event.message);
      // @ts-ignore
      result.push(event.timeToLife);
  }

  /**
   * 转换设备绑定安装点位事件
   * @param event  事件
   * @param result
   */
  protected transformWIthBindedPosition(event: DeviceBindedPositionEvent, result: Array<Object>){
      //依次压入事件属性
      result.push(event.id);
      result.push(event.functionalAreaId);
      result.push(event.positionId);
  }

  /**
   * 解析obj，并填充builder.
   * @param obj
   * @param builder
   */
  protected parseToInstalledEvent(obj: Object[]): DeviceInstalledEventBuilder {
      let builder = new DeviceInstalledEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());
      builder.withCategory(obj[3].toString());
      builder.withManufacturer(obj[4].toString());
      builder.withModel(obj[5].toString());
      builder.withSubsystem(obj[6].toString());
      builder.withFunctionalAreaId(obj[7].toString());
      builder.withPositionId(obj[8].toString());
      builder.withFactoryName(obj[9].toString());
      return builder;
  }

  /**
   * 解析obj，并填充builder.
   * @param obj
   * @param builder
   */
  protected parseToProducedEvent(obj: Object[]): DeviceProducedEventBuilder {
      let builder = new DeviceProducedEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());

      return builder;
  }

  /**
   * 解析obj，并填充builder.
   * @param obj
   * @param builder
   */
  protected parseToMaintenancedEvent(obj: Object[]): DeviceMaintenancedEventBuilder {
      let builder = new DeviceMaintenancedEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());

      return builder;
  }

  /**
   * 解析obj，并填充builder.
   * @param obj
   * @param builder
   */
  protected parseToUninstalledEvent(obj: Object[]): DeviceUninstalledEventBuilder {
      let builder = new DeviceUninstalledEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());
      builder.withSubsystem(obj[3].toString());

      return builder;
  }
  /**
   * 解析obj，并填充builder.
   * @param obj
   * @param builder
   */
  protected parseToDeviceAlarmEvent(obj: Object[]): DeviceAlarmEventBuilder {
      let builder = new DeviceAlarmEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());
      builder.withCategory(obj[3].toString());
      builder.withMessage(obj[4].toString());
      builder.withTimeToLife(Number(obj[5]));

      return builder;
  }

  protected parseToBindedPositionEvent(obj: Object[]): DeviceBindedPositionEventBuilder {
      let builder = new DeviceBindedPositionEventBuilder();
      //和transform方法次序对应
      builder.withId(obj[2].toString());
      builder.withFunctionAreaId(obj[3].toString());
      builder.withPositionId(obj[4].toString());

      return builder;
  }
}

/**
* 生命周期改变构建器
*/
export class DeviceLifecycleChangedEventBuilder extends DeviceEventBuilder {

  constructor() {
      super();
  }

}

/**
* 生命周期改变构建器
*/
export class DeviceProducedEventBuilder extends DeviceLifecycleChangedEventBuilder {
  constructor() {
      super();
  }

  build(): DeviceProducedEvent {
      return new DeviceProducedEvent(this);
  }
}

/**
* 设备安装事件构建器
*/
export class DeviceInstalledEventBuilder extends DeviceLifecycleChangedEventBuilder {
  // @ts-ignore
  private _manufacturer: string;
  // @ts-ignore
  private _model: string;
  // @ts-ignore
  private _category: string;
  // @ts-ignore
  private _subsystemName: string;
  // @ts-ignore
  private _functionalAreaId: string;
  // @ts-ignore
  private _positionId: string;
  // @ts-ignore
  private _factoryName: string;


  constructor() {
      super();
  }

  /**
   * 厂家
   */
  get manufacturer(): string {
      return this._manufacturer;
  }

  /**
   * 型号
   */
  get model(): string {
      return this._model;
  }

  /**
   * 设备分类
   */
  get category(): string{
      return this._category;
  }

  /**
   * 所属设备子系统
   */
  get subsystemName(): string {
      return this._subsystemName;
  }

  /**
   * 所在功能区编号
   */
  get functionalAreaId(): string{
      return this._functionalAreaId;
  }

  /**
   * 所在点位编号
   */
  get positionId(): string{
      return this._positionId;
  }

  /**
   * 设备工厂名称
   */
  get factoryName(): string{
      return this._factoryName;
  }


  /**
   * 设置生产厂家
   * @param value
   */
  withManufacturer(value: string): DeviceInstalledEventBuilder {
      this._manufacturer = value;
      return this;
  }

  /**
   * 设置设置型号
   * @param value
   */
  withModel(value: string): DeviceInstalledEventBuilder {
      this._model = value;
      return this;
  }

  /**
   *  设置设备分类
   * @param value
   */
  withCategory(value: string): DeviceInstalledEventBuilder {
      this._category = value;
      return this;
  }

  /**
   * 设置设备子系统名称
   * @param value
   */
  withSubsystem(value: string): DeviceInstalledEventBuilder {
      this._subsystemName = value;
      return this;
  }

  /**
   * 设置所属功能区编号
   * @param value
   */
  withFunctionalAreaId(value: string){
      this._functionalAreaId = value;
      return this;
  }

  /**
   * 设置所在的点位
   * @param value
   */
  withPositionId(value: string){
      this._positionId = value;
      return this;
  }

  /**
   * 设置设备工厂名称
   * @param value
   */
  withFactoryName(value: string){
      this._factoryName = value;
      return this;
  }

  build(): DeviceInstalledEvent {
      return new DeviceInstalledEvent(this);
  }
}

export class DeviceMaintenancedEventBuilder extends DeviceLifecycleChangedEventBuilder {
  constructor() {
      super();
  }

  build(): DeviceMaintenancedEvent {
      return new DeviceMaintenancedEvent(this);
  }
}

/**
* 设备卸载事件构建器
*/
export class DeviceUninstalledEventBuilder extends DeviceLifecycleChangedEventBuilder {
  // @ts-ignore
  private _manufacturer: string;
  // @ts-ignore
  private _model: string;
  // @ts-ignore
  private _subsystemName: string;

  constructor() {
      super();
  }

  /**
   * 所属设备子系统
   */
  get subsystemName(): string {
      return this._subsystemName;
  }

  /**
   * 设置设备子系统名称
   * @param value
   */
  withSubsystem(value: string): DeviceUninstalledEventBuilder {
      this._subsystemName = value;
      return this;
  }

  build(): DeviceUninstalledEvent {
      return new DeviceUninstalledEvent(this);
  }
}

export class DeviceBindedPositionEventBuilder extends DeviceEventBuilder {

  // @ts-ignore
  private _functionalAreaId: string;
  // @ts-ignore
  private _positionId: string;

  constructor(){
      super();
  }

  /**
   * 功能区编号
   */
  get functionalAreaId(): string{
      return this._functionalAreaId;
  }

  /**
   * 点位编号
   */
  get positionId(): string{
      return this._positionId;
  }

  /**
   * 设置功能区编号
   * @param value
   */
  withFunctionAreaId(value: string): DeviceBindedPositionEventBuilder {
      if (value){
          this._functionalAreaId = value;
      }
      return this;
  }

  /**
   * 设置点位编号
   * @param value
   */
  withPositionId(value: string): DeviceBindedPositionEventBuilder {
      if (value){
          this._positionId = value;
      }
      return this;
  }

  build(): DeviceBindedPositionEvent {
      return new DeviceBindedPositionEvent(this);
  }
}
/**
 * 设备预警事件构建器
 */
export class DeviceAlarmEventBuilder extends DeviceLifecycleChangedEventBuilder {

    private _message: String = '';
    private _category: String = '';
    private _timeToLife: number = 0;


    constructor(){
        super();
    }

    withMessage(value: String){
        this._message = value;
        return this;
    }

    withCategory(value: String){
        this._category = value;
        return this;
    }

    withTimeToLife(value: number){
        this._timeToLife = value;
        return this;
    }

    get category(): String{
        return this._category;
    }

    get message(): String{
        return this._message;
    }

    get timeToLife(): Number{
        return this._timeToLife;
    }

    build(): DeviceAlarmEvent {
        return new DeviceAlarmEvent(this);
    }
}
}