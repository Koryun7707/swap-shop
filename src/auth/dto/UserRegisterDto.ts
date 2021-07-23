'use strict';

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

export class UserRegisterDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message:'email is required' })
  @ApiProperty()
  @Column()
  readonly email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ minLength: 6 })
  @Column()
  readonly password: string;
}
