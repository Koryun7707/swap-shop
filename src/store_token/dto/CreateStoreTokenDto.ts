import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateStoreTokenDto {
  @IsNotEmpty({ message: 'token is required' })
  @ApiProperty()
  token: string;
}
