import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ProductConditionsEnum } from '../../enums/product-conditions.enum';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { Query } from '@nestjs/common';

export class UploadProductDto {
  @IsNotEmpty({ message: 'name must not be empty' })
  @ApiProperty()
  name: string;

  @IsNotEmpty({ message: 'brandName must not be empty' })
  @ApiProperty()
  brandName: string;

  @IsOptional()
  @ApiProperty()
  size: string;

  @IsNotEmpty({ message: 'color must not be empty' })
  @ApiProperty()
  color: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty({ enum: ProductConditionsEnum })
  @IsEnum(ProductConditionsEnum)
  // @ApiProperty({ enum: Object.keys(ProductConditionsEnum) })
  public productCondition: ProductConditionsEnum;

  @IsNotEmpty({ message: 'title must not be empty' })
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  dropOff: string;

  @IsOptional()
  @ApiProperty()
  images: string[];
}
