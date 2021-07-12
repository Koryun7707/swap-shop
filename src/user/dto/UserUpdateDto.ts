import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty({ message: 'First name must not be empty' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'Last name must not be empty' })
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiProperty()
  address1: string;

  @IsOptional()
  @ApiProperty()
  address2: string;

  @IsOptional()
  @ApiProperty()
  gender: string;

  @IsOptional()
  @ApiProperty()
  postCode: number;

  @IsOptional()
  @ApiProperty()
  description: string;
}
