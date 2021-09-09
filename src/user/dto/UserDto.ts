'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractDto } from '../../common/dto/AbstractDto';
import { UserEntity } from '../user.entity';

export class UserDto extends AbstractDto {
  @ApiPropertyOptional()
  firstName: string;

  @ApiPropertyOptional()
  lastName: string;

  @ApiPropertyOptional()
  address1: string;

  @ApiPropertyOptional()
  address2: string;

  @ApiPropertyOptional()
  gender: string;

  @ApiPropertyOptional()
  postCode: number;

  @ApiPropertyOptional()
  email: string;

  @ApiPropertyOptional()
  profilePicture: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  age: string;

  @ApiPropertyOptional()
  blocked: string[];

  @ApiPropertyOptional()
  blockedBy: string[];

  constructor(user: UserEntity) {
    super(user);
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.address1 = user.address1;
    this.address2 = user.address2;
    this.gender = user.gender;
    this.postCode = user.postCode;
    this.profilePicture = user.profilePicture;
    this.description = user.description;
    this.blocked = user.blocked;
    this.blockedBy = user.blockedBy;
    this.description = user.description;
    this.age = user.age;
  }
}
