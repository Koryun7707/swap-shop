import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { ProductService } from './product.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IFile } from '../interfaces/IFile';

@Controller('product')
@ApiTags('product')
@ApiBearerAuth()
export class ProductController {
  constructor(public readonly productService: ProductService) {}
  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UploadProductDto,
    description: 'upload product',
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadProduct(
    @AuthUser() user: UserEntity,
    @Body() uploadProductDto: UploadProductDto,
    @UploadedFiles() files: Array<IFile>,
  ): Promise<ProductDto> {
    return this.productService.uploadProduct(user, uploadProductDto, files);
  }
  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProductDto],
    description: 'get products',
  })
  async getProducts(
    @AuthUser() user: UserEntity
  ): Promise<ProductDto[]> {
    return this.productService.getProducts(user);
  }
}
