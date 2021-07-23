import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from './message.repository';
import { UserRepository } from '../user/user.repository';
import { AppGatewayModule } from '../gateway/app.gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageRepository, UserRepository]),
    forwardRef(() => AppGatewayModule),
  ],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
