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
<<<<<<< HEAD
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  clientIo: Socket;
=======
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
>>>>>>> 39fc670104ec100e29a917b6ec9f3df5984d8bd7
  handleDisconnect(client: Socket) {
    let user = client.handshake.auth;
  }
  handleConnection(client: Socket, ...args: any[]) {
<<<<<<< HEAD
    const user = client.handshake.auth;
    console.log(user);
    this.logger.log(`Client Connected: ${client.id}`);
=======
    let user = client.handshake.auth;
    console.log(user);
>>>>>>> 39fc670104ec100e29a917b6ec9f3df5984d8bd7
  }
  private logger: Logger = new Logger('AppGateWay');

  @SubscribeMessage('msgToServer')
<<<<<<< HEAD
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
=======
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
>>>>>>> 39fc670104ec100e29a917b6ec9f3df5984d8bd7
  }
}
let isTyping = false;
