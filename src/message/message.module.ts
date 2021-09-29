import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from './message.repository';
import { UserRepository } from '../user/user.repository';
import { AppGatewayModule } from '../gateway/app.gateway.module';
import { GroupRepository } from '../group/group.repository';
import { GroupUserRepository } from '../group_user/groupUser.repository';
import { StoreTokenRepository } from '../store_token/storeToken.repository';
import { StoreTokenService } from '../store_token/storeToken.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageRepository,
      UserRepository,
      GroupRepository,
      GroupUserRepository,
      StoreTokenRepository,
    ]),
    forwardRef(() => AppGatewayModule),
  ],
  providers: [MessageService, StoreTokenService],
  controllers: [MessageController],
})
export class MessageModule {}
