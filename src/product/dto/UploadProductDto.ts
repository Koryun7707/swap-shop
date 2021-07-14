import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UploadProductDto {
  // @IsNotEmpty({ message: 'name must not be empty' })
  @IsOptional()
  @ApiProperty()
  name: string;

  // @IsNotEmpty({ message: 'brandName must not be empty' })
  @IsOptional()
  @ApiProperty()
  brandName: string;

  @IsOptional()
  @ApiProperty()
  size: string;

  // @IsNotEmpty({ message: 'color must not be empty' })
  @IsOptional()
  @ApiProperty()
  color: string;

  @IsOptional()
  @ApiProperty()
  description: string;

  @IsOptional()
  @ApiProperty()
  productCondition: string;

  // @IsNotEmpty({ message: 'title must not be empty' })
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
