import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @IsOptional()
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
