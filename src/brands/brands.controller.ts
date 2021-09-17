import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { BrandsDto } from './dto/BrandsDto';
import { BrandsService } from './brands.service';

@Controller('brands')
@ApiTags('brands')
@ApiBearerAuth()
export class BrandsController {
  constructor(public readonly brandsService: BrandsService) {}

  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: BrandsDto,
    description: 'get brands',
  })
  async create(
    @AuthUser() user: UserEntity,
    @Query('search') search = '',
  ): Promise<BrandsDto[]> {
    return this.brandsService.searchBrands(user, search);
  }
}
