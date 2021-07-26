import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { ProductConditionsEnum } from '../../enums/product-conditions.enum';
import { ProductStatusEnum } from '../../enums/product-status.enum';
import { UserExistsRule } from '../../common/validators/user-exist.validation';
import { LocationExistsRule } from '../../common/validators/swap-location.validation';

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
  public productCondition: ProductConditionsEnum;

  @IsNotEmpty({ message: 'title must not be empty' })
  @ApiProperty()
  title: string;

  @IsOptional()
  @ApiProperty()
  @Validate(LocationExistsRule)
  dropOff: string;

  @IsOptional()
  @ApiProperty()
  images: string[];

  @IsOptional()
  @ApiProperty({ enum: ProductStatusEnum })
  @IsEnum(ProductStatusEnum)
  public status: ProductStatusEnum;

}
