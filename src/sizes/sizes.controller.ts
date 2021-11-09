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
import { SizesService } from './sizes.service';
import { SizesDto } from './dto/SizesDto';
import { SizeSearchDto } from './dto/SizeSearchDto';

@Controller('sizes')
@ApiTags('sizes')
@ApiBearerAuth()
export class SizesController {
  constructor(public readonly sizesService: SizesService) {}

  @UseGuards(AuthGuard)
  @Get('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SizeSearchDto,
    description: 'get sizes',
  })
  async search(
    @Query()  sizeSearchDto: SizeSearchDto
  ): Promise<SizesDto[]> {
    return this.sizesService.searchSizes(sizeSearchDto);
  }
}
