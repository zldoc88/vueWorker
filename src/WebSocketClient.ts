import { open } from "fs";

/**
 * webSocket客户端
 */
export interface IWebSocketClient {

    /**
     * 打开连接
     * @param regionId 区域编号 
     */
    open(regionId: string ): void;

    /**
     * 是否已经连接
     */
    connected(): boolean;

    /**
     * 关闭连接
     */
    close(regionId: string): void;
}

/**
 * WebSocketClient工厂
 */
export interface IWebSocketClientFactory {

    _socketUrl:string

    /**
     * 创建WebSocket客户端
     */
    createWebSocketClient(listener: IRemoteEventListener) : IWebSocketClient;
}

/**
 * 远程服务监听器
 */
export interface IRemoteEventListener {
    
    /**
     * 远程服务事件处理
     * @param event  
     */
    (event: JSON): void;
}