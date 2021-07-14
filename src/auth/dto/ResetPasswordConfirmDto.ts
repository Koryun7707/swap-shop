import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResetPasswordConfirmDto {
  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'password is required' })
  password: string;

  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'code is required' })
  code: number;
}
