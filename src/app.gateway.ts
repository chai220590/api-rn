import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
const io = new Server();

interface NewMessage {
  user: string;
  message: string;
}
interface UserInfo {
  userId: string;
  username: string;
  id: string;
}

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleDisconnect(client: Socket) {
    let user = client.handshake.auth;
  }
  handleConnection(client: Socket, ...args: any[]) {
    let user = client.handshake.auth;
    console.log(user);
  }
  private logger: Logger = new Logger('AppGateWay');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, message: NewMessage): void {
    console.log(message);
    client.emit('message', message);
    client.broadcast.emit('message', message);
  }

  @SubscribeMessage('typing')
  handleTyping(client: Socket, user: string): void {
    if (isTyping == false) {
      isTyping = true;
      client.broadcast.emit('onTyping', `${user} is typing`);

      setTimeout(() => {
        client.broadcast.emit('onTyping', ``);
        isTyping = false;
      }, 3000);
    }
  }
}
let isTyping = false;
