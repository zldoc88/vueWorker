import { IbmsEvent } from "./Event";
import { isNull } from "./Util";

// 设备子系统 事件转换器 名称
export const SUBSYSTEM_EVENTTRANSFORMER_NAME  =   "subsystem.transformer";

/**
 * 设备子系统事件
 */
export abstract class SubsystemEvent extends IbmsEvent {
    private readonly _name: string;


    constructor(builder: SubsystemEventBuilder){
        super();
        this._name = isNull(builder.name, "\"name\" cannot be null.");
    }

    /**
     * 设备子系统名称
     */
    get name():string{
        return this._name;
    }

    /**
     * 转换器名称
     */
    get transformerName(): string{
        return  SUBSYSTEM_EVENTTRANSFORMER_NAME;
    }
}

/**
 * 设备子系统连接事件
 */
export  class SubsystemConnectedEvent extends SubsystemEvent {
    private readonly _title: string;
    private readonly _icon: string;

    constructor(builder: SubsystemConnectedEventBuilder){
        super(builder);
        this._title = isNull(builder.title, "\"title\" cannot be null.");
        this._icon = isNull(builder.icon, "\"icon\" cannot be null.");
    }

    /**
     * 标题
     */
    get title(): string{
        return this._title;
    }

    /**
     * 图标
     */
    get icon(): string{
        return this._icon;
    }

    // @ts-ignore
    getMessage(source: string): string{
        return "设备子系统[" + this.name + "] 已经连接";
    }
}

/**
 * 设备子系统断开连接事件
 */
export class SubsystemDisconnectedEvent extends SubsystemEvent {
    constructor(builder: SubsystemDisconnectedEventBuilder){
        super(builder);
    }

    // @ts-ignore
    getMessage(source: string): string{
        return "设备子系统[" + this.name + "] 已经断开连接";
    }
}

/**
 * 设备子系统事件
 */
export class SubsystemEventBuilder  {
    // @ts-ignore
    private _name: string;

    constructor(){
    }

    /**
     * 名称
     */
    get name(): string{
        return this._name;
    }


    /**
     * 设置名称
     * @param value
     */
    withName(value: string): SubsystemEventBuilder {
        this._name = value;
        return this;
    }

}

/**
 * 设备子系统连接事件
 */
export class SubsystemConnectedEventBuilder  extends SubsystemEventBuilder{
    // @ts-ignore
    private _title: string;
    // @ts-ignore
    private _icon: string;

    constructor(){
        super();
    }

    /**
     * 标题
     */
    get title(): string{
        return this._title;
    }

    /**
     * 图标
     */
    get icon(): string {
        return this._icon;
    }

    /**
     * 设置标题
     * @param value
     */
    withTitle(value: string): SubsystemConnectedEventBuilder {
        this._title = value;
        return this;
    }

    /**
     * 设置图标
     * @param value
     */
    withIcon(value: string): SubsystemConnectedEventBuilder {
        this._icon = value;
        return this;
    }

    /**
     * 构建器
     */
    build(): SubsystemConnectedEvent {
        return new SubsystemConnectedEvent(this);
    }
}

/**
 * 设备子系统断开连接事件构建器
 */
export class SubsystemDisconnectedEventBuilder extends SubsystemEventBuilder {
    constructor(){
        super();
    }

    build(): SubsystemDisconnectedEvent{
        return new SubsystemDisconnectedEvent(this);
    }
}