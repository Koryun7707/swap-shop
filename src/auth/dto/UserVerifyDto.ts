import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserVerifyDto {
  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'code is required' })
  code: string;
}
