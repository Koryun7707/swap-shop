import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BlockedUserDto {
  @IsNotEmpty({ message: 'blockUserId must not be empty' })
  @ApiProperty()
  blockUserId: string;
}
