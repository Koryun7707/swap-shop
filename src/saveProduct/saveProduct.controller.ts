import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { SaveProductDto } from './dto/SaveProductDto';
import { CreateSaveProductDto } from './dto/CreateSaveProductDto';
import { SaveProductService } from './saveProduct.service';

@Controller('saveProduct')
@ApiTags('saveProduct')
@ApiBearerAuth()
export class SaveProductController {
  constructor(public readonly saveProductService: SaveProductService) {}
  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SaveProductDto,
    description: 'Save product',
  })
  async saveProduct(
    @AuthUser() user: UserEntity,
    @Body() createSaveProductDto: CreateSaveProductDto,
  ): Promise<SaveProductDto> {
    return this.saveProductService.saveProduct(user, createSaveProductDto);
  }
  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [SaveProductDto],
    description: 'get save products',
  })
  async getSavedProducts(
    @AuthUser() user: UserEntity,
  ): Promise<SaveProductDto[]> {
    return this.saveProductService.getSaveProducts(user);
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'delete save product',
  })
  async deleteSaveProduct(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return this.saveProductService.deleteSaveProduct(user, id);
  }
  @UseGuards(AuthGuard)
  @Delete('deleteByProductId/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'delete save product by productId',
  })
  async deleteSaveProductByProductId(
    @AuthUser() user: UserEntity,
    @Param('productId') productId: string,
  ): Promise<void> {
    return this.saveProductService.deleteSaveProductByProductId(
      user,
      productId,
    );
  }
}
