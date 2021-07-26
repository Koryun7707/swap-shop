import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UploadImageDto {
  @IsNotEmpty({ message: 'file must not be empty' })
  @ApiProperty()
  file: string;
}
