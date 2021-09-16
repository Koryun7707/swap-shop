import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LastMessageViewerDto {
  @IsString()
  @IsNotEmpty({ message: 'lastMessageViewer is required' })
  @ApiProperty()
  id: string;
}
