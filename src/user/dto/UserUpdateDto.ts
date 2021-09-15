import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsNotEmpty({ message: 'firstName id is required' })
  @ApiProperty()
  firstName: string;

  @IsNotEmpty({ message: 'lastName id is required' })
  @ApiProperty()
  lastName: string;

  @IsNotEmpty({ message: 'address1q id is required' })
  @ApiProperty()
  address1: string;

  @IsOptional()
  @ApiProperty()
  address2: string;

  @IsNotEmpty({ message: 'postCode id is required' })
  @ApiProperty()
  postCode: number;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  age: string;
}
