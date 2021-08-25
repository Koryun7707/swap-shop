import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'receiverId is required' })
  @ApiProperty()
  receiverId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  message: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  messageImage: string[];

  @IsString()
  @IsOptional()
  @ApiProperty()
  groupId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  dropOff: string;
}
