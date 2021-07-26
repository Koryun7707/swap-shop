import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, UseFilters } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { WsExceptionFilter } from '../common/filters/ws-exception.filter';
import { MessageEventEnum } from '../common/constants/message-event';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: '/message', transports: ['websocket'] })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage(MessageEventEnum.CREATE_MESSAGE)
  create(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
    @AuthUser() user: UserEntity,
  ): void {
    this.broadcast(client, MessageEventEnum.CREATE_MESSAGE, message, user);
  }
  broadcast(socket: Socket, eventName: string, message: string, user) {
    if (socket) {
      socket.broadcast.to(user.id).emit(eventName, message);
    } else {
      this.server.to(user.id).emit(eventName, message);
    }
  }
  @SubscribeMessage('joinRoom')
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  afterInit(server: Server): void {
    return this.logger.log('Init');
  }

  handleConnection(client: Socket): void {
    return this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }
}
