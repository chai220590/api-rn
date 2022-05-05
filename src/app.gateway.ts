import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
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
  clientIo: Socket;
  handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected: ${client.id}`);
  }
  handleConnection(client: Socket, ...args: any[]) {
    const user = client.handshake.auth;
    console.log(user);
    this.logger.log(`Client Connected: ${client.id}`);
  }
  private logger: Logger = new Logger('AppGateWay');
  afterInit(server: any) {
    this.logger.log('Initiailized');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, text: string): void {
    const user = client.handshake.auth;
    client.emit('msgToClient', {
      username: user.username,
      message: text,
      createDate: Date.now(),
      avatar: user.avatar,
    });
    client.broadcast.emit('msgToClient', {
      username: user.username,
      message: text,
      createDate: Date.now(),
      avatar: user.avatar,
    });
  }
}
