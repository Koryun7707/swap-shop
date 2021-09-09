import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ProductDto } from './ProductDto';
import { UserDto } from '../../user/dto/UserDto';

export class SearchDto {
  @IsOptional()
  @ApiPropertyOptional()
  products: ProductDto[];

  @IsOptional()
  @ApiPropertyOptional()
  users: UserDto[];
}
