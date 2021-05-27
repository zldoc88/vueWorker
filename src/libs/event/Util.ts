let WebSocketURLDefault: string = `ws://192.168.1.164:8081/subscriptions`,
    protocolsDefault: string = 'graphql-ws';

let promise001_ins: any = null;


/**
 * 判断target是否为null.
 * @param target  目标对象
 * @param message 错误消息
 * @returns 返回不为null的target.
 */
export function isNull<T>(target: T, message: string ): T {
  if (!target){
      throw new Error(message);
  }

  return target;
}

/**
* 断言接口
*/
export interface IPredicate<T> {

  /**
   * 判断target是否满足断言.
   */
  (target: T): boolean;
}

/**
 * WebSocket客户端类
 */
export class WebSocket4Client {

  /**
   * WebSocket客户端实例
   */
  ws4Client;

  _onClose: any;
  _onError: any;
  _onMessage: any;
  _onOpen: any;

  /**
   * WebSocket客户端类的构造函数<br />
   * PS:<br />
   * 1、异常说明：<br />
   * SECURITY_ERR：尝试连接的端口被阻止。<br />
   *
   * @param url 字符串，要连接的URL；这应该是WebSocket服务器将响应的URL。必须
   *
   * @param opt JSON配置对象，可选<br />
   * {<br />
   * protocols: String|[ String ] 单个协议字符串或协议字符串数组。这些字符串用于指示子协议，以便单个服务器可以实现多个WebSocket子协议<br />
   * （例如，您可能希望一个服务器能够根据指定的协议处理不同类型的交互）。如果不指定协议字符串，则假定为空字符串。<br />
   * 默认值是null，undefined、null、''都表示不传这个参数，所以，不传就别设置任何参数了。<br /><br />
   *
   * onClose: ( ws, event ) => {}，当与WebSocket的连接关闭时触发，该事件有两个参数(ws, event)，可选。<br /><br />
   *
   * onError: ( ws, event ) => {}，当由于错误而关闭与WebSocket的连接时触发，例如无法发送某些数据时触发，该事件有两个参数(ws, event)，可选。<br /><br />
   *
   * onMessage: ( ws, event, data ) => {}，通过WebSocket接收数据时激发，该事件有三个参数(ws, event, data)，可选。<br /><br />
   *
   * onOpen: ( ws, event ) => {}，打开与WebSocket的连接时激发，该事件有两个参数(ws, event)，可选。<br /><br />
   */
  // @ts-ignore
  constructor( url, {
    // @ts-ignore
      protocols = null,
      // @ts-ignore
      onClose = ( ws, event ) => {
      },
      // @ts-ignore
      onError = ( ws, event ) => {
      },
      // @ts-ignore
      onMessage = ( ws, event, data ) => {
      },
      // @ts-ignore
      onOpen = ( ws, event ) => {
      },
  } = {} ){
      !protocols
      ? ( this.ws4Client = new WebSocket( url ) )
      : ( this.ws4Client = new WebSocket( url, protocols ) );

      this._onClose = onClose;
      this._onError = onError;
      this._onMessage = onMessage;
      this._onOpen = onOpen;

      this.ws4Client.onclose = ( ...rest ) => {
          this._onClose( this.ws4Client, ...rest );
      };

      this.ws4Client.onerror = ( ...rest ) => {
          this._onError( this.ws4Client, ...rest );
      };

      this.ws4Client.onmessage = event => {
          this._onMessage( this.ws4Client, event, event.data );
      };

      this.ws4Client.onopen = ( ...rest ) => {
          this._onOpen( this.ws4Client, ...rest );
      };
  }

  /**
   * 关闭WebSocket连接<br />
   * PS:<br />
   * 1、异常说明：<br />
   * INVALID_ACCESS_ERR：指定了无效的code。<br />
   * SYNTAX_ERR：“reason”字符串太长或包含未配对的代理项。<br />
   *
   * @param code 数字，默认值为1000(正常关闭；连接成功完成了创建目的。)，可选，指示状态代码的数字值，用于解释为什么关闭连接。如果未指定此参数，则默认值为1005。<br />
   * 有关允许的值，请参见CloseEvent的状态代码列表。<br />
   * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes<br />
   * PS:<br />
   * 代码必须是1000或介于3000和4999之间。
   *
   * @param reason 字符串，默认值为字符串: '手动关闭！'，可选，易于理解的字符串，说明连接为何关闭。该字符串不得超过123个字节的UTF-8文本（非字符）。
   */
  close( code = 1000, reason = '手动关闭！' ){
      this.ws4Client.close( code, reason );
  }

  /**
   * 往服务器发送数据<br />
   * PS:<br />
   * 1、这个WebSocket.send()方法将要通过WebSocket连接传输到服务器的指定数据排队，将“bufferedAmount”的值增加包含数据所需的字节数。<br />
   * 如果数据无法发送（例如，因为它需要缓冲，但缓冲区已满），套接字将自动关闭。<br />
   * 2、异常说明:<br />
   * INVALID_STATE_ERR：该连接当前未打开。<br />
   * SYNTAX_ERR：数据是具有未配对替代的字符串。<br />
   *
   * @param data 数据发送到服务器。必须，它可能是下列类型之一：<br />
   * 1、String<br />
   * 文本字符串。字符串以UTF-8格式添加到缓冲区中，“bufferedAmount”的值将增加表示UTF-8字符串所需的字节数。<br /><br />
   *
   * 2、ArrayBuffer<br />
   * 您可以发送类型化数组对象使用的基础二进制数据。它的二进制数据内容在缓冲区中排队，从而将bufferedAmount的值增加了必需的字节数。<br /><br />
   *
   * 3、Blob<br />
   * 指定“Blob”会将Blob的原始数据排队，以便在二进制帧中传输。“bufferedAmount”的值随原始数据的字节大小而增加。<br /><br />
   *
   * 4、ArrayBufferView<br />
   * 可以将任何JavaScript类型的数组对象作为二进制帧发送；它的二进制数据内容在缓冲区中排队，从而将“bufferedAmount”的值增加所需的字节数。
   */
  // @ts-ignore
  send( data ){
      this.ws4Client.send( data );
  }

  /**
   * 当与WebSocket的连接关闭时触发。
   *
   * @param eventFun 函数，该事件有两个参数(ws, event)，必须
   */
  // @ts-ignore
  setOnClose( eventFun = ( ws, event ) => {
  } ){
      this._onClose = eventFun;
  }

  /**
   * 当由于错误而关闭与WebSocket的连接时触发，例如无法发送某些数据时触发。
   *
   * @param eventFun 函数，该事件有两个参数(ws, event)，必须
   */
  // @ts-ignore
  setOnError( eventFun = ( ws, event ) => {
  } ){
      this._onError = eventFun;
  }

  /**
   * 通过WebSocket接收数据时激发。
   *
   * @param eventFun 函数，该事件有三个参数(ws, event, data)，必须
   */
  // @ts-ignore
  setOnMessage( eventFun = ( ws, event, data ) => {
  } ){
      this._onMessage = eventFun;
  }

  /**
   * 打开与WebSocket的连接时激发。
   *
   * @param eventFun 函数，该事件有两个参数(ws, event)，必须
   */
  // @ts-ignore
  setOnOpen( eventFun = ( ws, event ) => {
  } ){
      this._onOpen = eventFun;
  }

  /**
   * 只读属性返回连接正在传输的二进制数据的类型。<br />
   * PS:返回如下几个字符串<br />
   * 1、blob：如果使用Blob对象。<br />
   * 2、arraybuffer：如果使用ArrayBuffer对象。<br />
   *
   * @returns {String} String
   */
  getBType(){
      return this.ws4Client.binaryType;
  }

  /**
   * 只读属性返回已使用send()调用排队但尚未传输到网络的数据字节数。一旦发送完所有排队数据，此值将重置为零。<br />
   * 当连接关闭时，此值不会重置为零；<br />
   * 如果继续调用send()，则此值将继续攀升。
   *
   * @returns {Number} Number
   */
  getBufAmount(){
      return this.ws4Client.bufferedAmount;
  }

  /**
   * 只读属性返回服务器选择的扩展。当前这只是空字符串或由连接协商的扩展名列表。
   *
   * @returns {String} String
   */
  getExtensions(){
      return this.ws4Client.extensions;
  }

  /**
   * 只读属性返回服务器选择的子协议的名称；这将是创建WebSocket对象时在protocols参数中指定的字符串之一，如果未建立连接，则为空字符串。
   *
   * @returns {String} String
   */
  getProtocol(){
      return this.ws4Client.protocol;
  }

  /**
   * 只读属性返回WebSocket连接的当前状态。<br />
   * 返回以下无符号整数值之一：<br />
   * 0    CONNECTING    套接字已创建。连接尚未打开。Socket has been created. The connection is not yet open.<br />
   * 1    OPEN        连接已打开，可以进行通讯了。The connection is open and ready to communicate.<br />
   * 2    CLOSING        连接正在关闭中。The connection is in the process of closing.<br />
   * 3    CLOSED        连接已关闭或无法打开。The connection is closed or couldn't be opened.<br />
   *
   * @returns {Number} Number
   */
  getReadyState(){
      return this.ws4Client.readyState;
  }

  /**
   * 只读属性返回由构造函数解析的WebSocket的绝对URL。
   *
   * @returns {String} String
   */
  getURL(){
      return this.ws4Client.url;
  }

}


export function Handle001( {
  WebSocketURL = '',
  protocols = '',
} ){
    promise001_ins = new Promise( ( resolve = () => {}, reject = () => {} ) => {
        let webSocket4Client_ins: WebSocket4Client = new WebSocket4Client( WebSocketURL, {
            protocols,

            onClose: ( ws, event ) => void ( resolve( {
                state: 'close',
                ws,
                event,
                wsIns: webSocket4Client_ins,
            } ) ),
            onError: ( ws, event ) => void ( reject( {
                state: 'error',
                ws,
                event,
                wsIns: webSocket4Client_ins,
            } ) ),
            onMessage: ( ws, event, data ) => void ( resolve( {
                state: 'message',
                ws,
                event,
                data,
                wsIns: webSocket4Client_ins,
            } ) ),
            onOpen: ( ws, event ) => void ( resolve( {
                state: 'open',
                ws,
                event,
                wsIns: webSocket4Client_ins,
            } ) ),
        } );

        return webSocket4Client_ins;
    } );
}

/**
* 创建一个WebSocket连接<br />
* PS：<br />
* 只有两个参数，为JSON配置对象，有如下属性：WebSocketURL、protocols。<br />
*
* @param WebSocketURL 字符串，WebSocket连接地址，默认值为：WebSocketURLDefault这个变量所存的值，无特殊情况可以不传，可选
*
* @param protocols 字符串，WebSocket连接协议，默认值为："graphql-ws"，无特殊情况可以不传，可选
*
* @returns {Promise<Object>} Promise<Object>
*/
export function WebSocketCreate( {
        WebSocketURL = WebSocketURLDefault,
        protocols = protocolsDefault,
    } = {} ){
    if(!promise001_ins){
        //console.log('WebSocketURL=>',WebSocketURL);
         Handle001( {
            WebSocketURL,
            protocols,
            } ) ;
    }

return promise001_ins;
}

/**
* WebSocket连接初始化，这步操作主要是为了防止连接超时自动断开<br />
* PS：<br />
* 1、只有两个参数，为JSON配置对象，有如下属性：wsIns、sendData。<br />
* 2、这个WebSocket.send()方法将要通过WebSocket连接传输到服务器的指定数据排队，将“bufferedAmount”的值增加包含数据所需的字节数。<br />
* 如果数据无法发送（例如，因为它需要缓冲，但缓冲区已满），套接字将自动关闭。<br />
* 3、异常说明:<br />
* INVALID_STATE_ERR：该连接当前未打开。<br />
* SYNTAX_ERR：数据是具有未配对替代的字符串。<br />
*
* @param wsIns WebSocket4Client这个类的实例，必须
*
* @param sendData 数据发送到服务器。默认值是：JSON.stringify( { type: 'connection_init', } )，无特殊情况可以不传，可选，它可能是下列类型之一：<br />
* 1、String<br />
* 文本字符串。字符串以UTF-8格式添加到缓冲区中，“bufferedAmount”的值将增加表示UTF-8字符串所需的字节数。<br /><br />
*
* 2、ArrayBuffer<br />
* 您可以发送类型化数组对象使用的基础二进制数据。它的二进制数据内容在缓冲区中排队，从而将bufferedAmount的值增加了必需的字节数。<br /><br />
*
* 3、Blob<br />
* 指定“Blob”会将Blob的原始数据排队，以便在二进制帧中传输。“bufferedAmount”的值随原始数据的字节大小而增加。<br /><br />
*
* 4、ArrayBufferView<br />
* 可以将任何JavaScript类型的数组对象作为二进制帧发送；它的二进制数据内容在缓冲区中排队，从而将“bufferedAmount”的值增加所需的字节数。
*/
export function WSConnectionInit( {
    // @ts-ignore
         wsIns,
         sendData = JSON.stringify( {
             type: 'connection_init',
         } ),
     } = {} ){
wsIns.send( sendData );
}
