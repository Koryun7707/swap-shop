import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserExistsRule } from '../common/validators/user-exist.validation';
import { MailModule } from '../mail/mail.module';
import { StoreTokenRepository } from '../store_token/storeToken.repository';
import { StoreTokenService } from '../store_token/storeToken.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, StoreTokenRepository]),
    forwardRef(() => MailModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserExistsRule, StoreTokenService],
  exports: [UserService],
})
export class UserModule {}
