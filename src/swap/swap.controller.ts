import {
  BadRequestException,
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post, Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { SwapDto } from './dto/SwapDto';
import { CreateSwapDto } from './dto/CreateSwapDto';
import { SwapEntity } from './swap.entity';

@Controller('swap')
@ApiTags('swap')
@ApiBearerAuth()
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @UseGuards(AuthGuard)
  @Post('')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: SwapDto,
    description: 'swap request',
  })
  async swapRequest(
    @AuthUser() user: UserEntity,
    @Body() createSwapDto: CreateSwapDto,
  ): Promise<Promise<SwapEntity> | BadRequestException> {
    return this.swapService.saveSwapRequest(user,createSwapDto)
  }

  @UseGuards(AuthGuard)
  @Get('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Swap Notifications',
  })
  async swapNotifications(
    @AuthUser() user: UserEntity
  ){
    return await this.swapService.getSwapNotifications(user)
  }





}
