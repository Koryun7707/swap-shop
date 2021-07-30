import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../decorators/auth-user.decorator';
import { UserEntity } from '../user/user.entity';
import { SwapDto } from './dto/SwapDto';
import { CreateSwapDto } from './dto/CreateSwapDto';
import { SwapEntity } from './swap.entity';
import { ApprovedSwapDto } from './dto/ApprovedSwapDto';
import { ApprovedSwapNotificationsDto } from './dto/ApprovedSwapNotificationsDto';

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
    description: 'Save swap request',
  })
  async swapRequest(
    @AuthUser() user: UserEntity,
    @Body() createSwapDto: CreateSwapDto,
  ): Promise<SwapEntity> {
    return this.swapService.saveSwapRequest(user, createSwapDto);
  }

  @UseGuards(AuthGuard)
  @Get('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: [SwapDto],
    description: 'Get new notifications',
  })
  async getNewSwapNotifications(
    @AuthUser() user: UserEntity,
  ): Promise<SwapEntity[]> {
    return await this.swapService.getNewSwapNotifications(user);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Get all swap request',
  })
  async getAll(
    @AuthUser() user: UserEntity,
    approvedSwapNotificationsDto: ApprovedSwapNotificationsDto,
  ): Promise<SwapEntity[]> {
    return await this.swapService.getAll(user, approvedSwapNotificationsDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Delete Swap Request',
  })
  async swapDelete(
    @AuthUser() user: UserEntity,
    @Param('id') id: string,
  ): Promise<void> {
    return await this.swapService.deleteSwapRequest(user, id);
  }

  @UseGuards(AuthGuard)
  @Post('approve')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Approve Swap Request',
  })
  async swapApprove(
    @AuthUser() user: UserEntity,
    @Body() approvedSwapDto: ApprovedSwapDto,
  ): Promise<SwapEntity> {
    return await this.swapService.approveSwapRequest(user, approvedSwapDto);
  }

  @UseGuards(AuthGuard)
  @Get('seen-notification')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Make "seen" swap request',
  })
  async swapMakeSeenNotification(
    @AuthUser() user: UserEntity,
    @Query('id', new ParseUUIDPipe()) uuid: string,
  ): Promise<SwapEntity> {
    return await this.swapService.makeSeenNotification(user, uuid);
  }
}
