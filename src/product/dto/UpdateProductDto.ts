import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ProductConditionsEnum } from '../../enums/product-conditions.enum';

export class UpdateProductDto {
  @IsOptional()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiProperty()
  brandName: string;

  @IsOptional()
  @ApiProperty()
  size: string;

  @IsOptional()
  @ApiProperty()
  color: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsOptional()
  @IsEnum(ProductConditionsEnum)
  public productCondition: ProductConditionsEnum;

  @IsOptional()
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  dropOff: string;

  @IsOptional()
  @ApiProperty()
  images: string[];
}
