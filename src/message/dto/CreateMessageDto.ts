import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'receiver is required' })
  @ApiProperty()
  receiver: string;

  @IsString()
  @ApiProperty()
  message: string;
}
