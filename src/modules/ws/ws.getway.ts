import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { ProgressConf } from './ws.class';

@WebSocketGateway(3002)
export class WsGateway {
  /**
   * 进度
   * @param data
   * @returns
   */
  @SubscribeMessage('progress')
  hello(@MessageBody() data: ProgressConf): any {
    const { taskId } = data;

    // 询问指定task的 进度

    return {
      event: 'hello',
      data: data,
      msg: 'rustfisher.com',
    };
  }
}
