import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserExistsRule } from '../common/validators/user-exist.validation';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  controllers: [UserController],
  providers: [UserService,UserExistsRule],
  exports: [UserService],
})
export class UserModule {}
