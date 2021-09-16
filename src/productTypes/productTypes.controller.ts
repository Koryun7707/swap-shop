import {
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { ProductTypesDto } from './dto/ProductTypesDto';
import { ProductTypesService } from './productTypes.service';

@Controller('productTypes')
@ApiTags('productTypes')
@ApiBearerAuth()
export class ProductTypesController {
  constructor(public readonly productTypesService: ProductTypesService) {}

  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ProductTypesDto,
    description: 'get product types',
  })
  async create(
    @AuthUser() user: UserEntity,
    @Query('search') search = '',
  ): Promise<ProductTypesDto[]> {
    return this.productTypesService.searchProductTypes(user, search);
  }
}
