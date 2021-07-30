import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from './message.repository';
import { UserRepository } from '../user/user.repository';
import { AppGatewayModule } from '../gateway/app.gateway.module';
import { GroupRepository } from '../group/group.repository';
import { GroupUserRepository } from '../group_user/groupUser.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      UserRepository,
      GroupRepository,
      GroupUserRepository,
    ]),
    forwardRef(() => AppGatewayModule),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
