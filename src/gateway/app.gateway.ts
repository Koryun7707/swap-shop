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
    @MessageBody() message: any,
    room: string,
  ): void {
    this.broadcast(client, MessageEventEnum.CREATE_MESSAGE, message, room);
  }
  @SubscribeMessage(MessageEventEnum.CREATE_MESSAGE)
  update(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
    room: string,
  ): void {
    this.broadcast(client, MessageEventEnum.UPDATE_MESSAGE, message, room);
  }
  @SubscribeMessage(MessageEventEnum.DELETE_MESSAGE)
  delete(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: any,
    room: string,
  ): void {
    this.broadcast(client, MessageEventEnum.DELETE_MESSAGE, message, room);
  }
  broadcast(socket: Socket, eventName: string, message: any, room: string) {
    if (socket) {
      socket.broadcast.to(room).emit(eventName, message);
    } else {
      this.server.to(room).emit(eventName, message);
    }
  }
  @SubscribeMessage(MessageEventEnum.JOIN_ROOM)
  public joinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit(MessageEventEnum.JOIN_ROOM, room);
  }

  @SubscribeMessage(MessageEventEnum.LEAVE_ROOM)
  public leaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit(MessageEventEnum.LEAVE_ROOM, room);
  }

  afterInit(server: Server): void {
    return this.logger.log('Init Socket');
  }

  handleConnection(client: Socket): void {
        // const user = await this._socketGuard.connectAuth(client);
    // if (user) {
    //   const isOnline = true;
    //   const updatedUser = await this._boardUserOnlineService.createOrUpdate(
    //     user,
    //     boardId,
    //     isOnline,
    //   );
    //   this.boardcastToBoardId(client, BoardEventEnum.MEMBER_STATUS, {
    //     boardId,
    //     data: updatedUser,
    //   });
    // }

    if (client.handshake.query?.groupId) {
      client.join(client.handshake.query.groupId);
      client.emit(MessageEventEnum.JOIN_ROOM, client.handshake.query.groupId);
    }
    return this.logger.log(`Client connected ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }
}
