import {isNull, WebSocketCreate, WSConnectionInit} from "./libs/event/Util";
import {IRemoteEventListener, IWebSocketClient, IWebSocketClientFactory} from "./WebSocketClient";
import gql from 'graphql-tag'
import apolloClient from './libs/graphql/Graphql'

class MockWebSocketClient implements IWebSocketClient {

    private readonly _listener : IRemoteEventListener;
    private _connected : boolean;
    private _WebSocket4Client: any;
    private _WebSocketUrl: any;

    constructor(listener : IRemoteEventListener,url:string) {
        this._listener = isNull(listener, "\"listener\" cannot be null.");
        this._WebSocketUrl = isNull(url, "\"_WebSocketUrl\" cannot be null.");
        WebSocketCreate({WebSocketURL:this._WebSocketUrl})
        .then(
            ( {
                  state,
                  ws,
                  event,
                  data = null,
                  wsIns,
              }: any ): void => {
                if( state === 'open' ){
                    console.log( 'WebSocket连接已打开！！！' );
                    this._WebSocket4Client = wsIns;
                    WSConnectionInit( {
                        wsIns: this._WebSocket4Client,
                    } );
                }

                if( state === 'close' ){
                    console.warn( 'WebSocket连接关闭了！！！End' );
                }


            },
            ( {
                  state,
                  ws,
                  event,
                  wsIns
              }: any ): void => {
                if( state === 'error' ){
                    console.error( 'WebSocket连接错误！！！End' );
                }
            }
        );


    }

    open(regionId : string): void {
        this.doConnect(this._WebSocket4Client,regionId );
        this._connected = true;
        // 打开后，模拟发出服务端的事件.
        this._WebSocket4Client.setOnMessage(this._listener);
    }

    connected(): boolean {
        return this._connected;
    }

    close(regionId : string): void {
        this.cutConnect(this._WebSocket4Client,regionId)
        this._connected = false;
    }


    createWebsocket(){
        WebSocketCreate()
        .then(
            ( {
                  state,
                  ws,
                  event,
                  data = null,
                  wsIns,
              }: any ): void => {
                if( state === 'open' ){
                    console.log( 'WebSocket连接已打开！！！' );
                    this._WebSocket4Client = wsIns;
                    WSConnectionInit( {
                        wsIns: this._WebSocket4Client,
                    } );
                }
                if( state === 'close' ){
                    console.warn( 'WebSocket连接关闭了！！！End' );
                }
            },
            ( {
                  state,
                  ws,
                  event,
                  wsIns
              }: any ): void => {
                if( state === 'error' ){
                    console.error( 'WebSocket连接错误！！！End' );
                }
            }
        );
    }

    get WebSocket4Client(){
        return this._WebSocket4Client;
    }

    private doConnect( wsIns: any, functionalAreaId: string ): void {
        console.log('functionalAreaId=>',functionalAreaId);
        startSubscription( {
            wsIns,
            id: functionalAreaId,
            payload: {
                operationName: 'DeviceEvents4FunctionalArea',
                variables: {
                    functionalAreaId,
                },
                // 待后端接口弄好后，接 按楼层推送设备事件 接口。
                query: `subscription DeviceEvents4FunctionalArea( $functionalAreaId: String! ) {
                    AllDeviceEvents: ibms_onDeviceEvent( functionalAreaId: $functionalAreaId ) {
                        deviceId,
                        __typename,
                    },
                }`,
            },
        } );
    }

    private cutConnect( wsIns: any, functionalAreaId: string ){
        stopSubscription( {
            wsIns,
            id: functionalAreaId,
        } );
    }
}

export class MockWebSocketClientFactory implements IWebSocketClientFactory {
    public _socketUrl='';
    constructor(url:string) {
        this._socketUrl = isNull(url, "\"_socketUrl\" cannot be null.");
    }

    createWebSocketClient(listener : IRemoteEventListener): IWebSocketClient {
        // @ts-ignore
        return new MockWebSocketClient(listener , this._socketUrl);
        // throw new Error("Method not implemented.");
    }


}

/**
 * 根据指定的id开始订阅<br />
 * PS：<br />
 * 1、只有三个参数，为JSON配置对象，有如下属性：wsIns、id、payload。<br />
 *
 * @param wsIns WebSocket4Client这个类的实例，必须
 *
 * @param id 一般是字符串、数字都行，默认值是：undefined(表示这个id字段不会传给后端服务器)，建议必须
 *
 * @param payload 可以被JSON.stringify()字符串化的数据类型都行，默认值是：undefined(表示这个payload字段不会传给后端服务器)，建议必须
 */
function startSubscription( {
    // @ts-ignore
    wsIns,
    id = undefined,
    payload = undefined,
    } = {} ){
    const obj: object = {
    type: 'start',
    };

    if( id ){
        // @ts-ignore
        obj.id = id;
    }

    if( payload ){
        // @ts-ignore
        obj.payload = payload;
    }

    wsIns.send( JSON.stringify( obj ) );
}


/**
 * 根据指定的id停止订阅<br />
 * PS：<br />
 * 1、只有三个参数，为JSON配置对象，有如下属性：wsIns、id、payload。<br />
 *
 * @param wsIns WebSocket4Client这个类的实例，必须
 *
 * @param id 一般是字符串、数字都行，默认值是：undefined(表示这个id字段不会传给后端服务器)，建议必须
 *
 * @param payload 可以被JSON.stringify()字符串化的数据类型都行，默认值是：undefined(表示这个payload字段不会传给后端服务器)，建议必须
 */
function stopSubscription( {
    // @ts-ignore
    wsIns,
    id = undefined,
    payload = undefined,
    } = {} ){
    const obj = {
    type: 'stop',
    };

    if( id ){
        // @ts-ignore
        obj.id = id;
    }

    if( payload ){
        // @ts-ignore
        obj.payload = payload;
    }

    wsIns.send( JSON.stringify( obj ) );
}
