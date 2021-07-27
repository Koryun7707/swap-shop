import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSaveProductDto {
  @IsNotEmpty({ message: 'productId is required' })
  @ApiProperty()
  productId: string;
}
