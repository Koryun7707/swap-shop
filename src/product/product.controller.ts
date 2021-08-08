import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/UpdateProductDto';

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
  async uploadProduct(
    @AuthUser() user: UserEntity,
    @Body() uploadProductDto: UploadProductDto,
  ): Promise<ProductDto> {
    return this.productService.uploadProduct(user, uploadProductDto);
  }

  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProductDto],
    description: 'get products',
  })
  async getProducts(@AuthUser() user: UserEntity): Promise<ProductDto[]> {
    return this.productService.getProducts(user);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProductDto],
    description: 'get All products',
  })
  async getAllProducts(@AuthUser() user: UserEntity): Promise<ProductDto[]> {
    return this.productService.getAllProducts(user);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductDto,
    description: 'Delete products',
  })
  async deleteProduct(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productService.deleteProduct(user, id);
  }

  @UseGuards(AuthGuard)
  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProductDto],
    description: 'search products',
  })
  async searchProduct(
    @AuthUser() user: UserEntity,
    @Query('search') search?: string,
  ): Promise<ProductDto[]> {
    return this.productService.searchProduct(user, search);
  }
  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdateProductDto,
    description: 'update product',
  })
  async updateProduct(
    @Param('id') id: string,
    @AuthUser() user: UserEntity,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productService.updateProduct(user, id, updateProductDto);
  }
  @UseGuards(AuthGuard)
  @Get('filter')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [ProductDto],
    description: 'search products',
  })
  async filterProduct(
    @AuthUser() user: UserEntity,
    @Query('filter') filter?: string,
  ): Promise<ProductDto[]> {
    return this.productService.filterProduct(user, filter);
  }
}
