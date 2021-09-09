import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UnBlockUserDto {
  @IsNotEmpty({ message: 'unBlockUserId must not be empty' })
  @ApiProperty()
  unBlockUserId: string;
}
