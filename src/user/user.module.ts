import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserExistsRule } from '../common/validators/user-exist.validation';
import { MailModule } from '../mail/mail.module';
import { StoreTokenRepository } from '../store_token/storeToken.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, StoreTokenRepository]),
    forwardRef(() => MailModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserExistsRule],
  exports: [UserService],
})
export class UserModule {}
