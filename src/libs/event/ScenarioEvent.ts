import { IbmsEvent } from "./Event";
import { isNull } from "./Util";

/**
 * 抽象的场景事件
 */
export abstract class ScenarioEvent extends IbmsEvent {
    private readonly _id: string;

    constructor(builder: ScenarioEventBuilder){
        super();
        this._id = isNull(builder.id, "\"id\" cannot be null.");
    }

    /**
     * 场景编号
     */
    get id(): string{
        return this._id;
    }
}

/**
 * 场景事件构建器
 */
export abstract class ScenarioEventBuilder {
    // @ts-ignore
    private _id: string;

    constructor(){
    }

    /**
     * 场景编号
     */
    get id(): string{
        return this._id;
    }

    /**
     * 设置场景编号
     * @param value 编号
     */
    withId(value: string): ScenarioEventBuilder {
        this._id = value;
        return this;
    }
}