import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client Connected: ${client.id}`);
  }
  private logger: Logger = new Logger('AppGateWay');
  afterInit(server: any) {
    this.logger.log('Initiailized');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): WsResponse<string> {
    return {
      event: 'msgToClient',
      data: text,
    };
  }
}
