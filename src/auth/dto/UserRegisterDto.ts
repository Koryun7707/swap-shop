'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from 'class-validator';
import { Column } from 'typeorm';
import { CorrectEmails } from '../../common/validators/correct-emails.validation';

export class UserRegisterDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  @ApiProperty()
  @Column()
  @Validate(CorrectEmails)
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  @Column()
  readonly password: string;
}
