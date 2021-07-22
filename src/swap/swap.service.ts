import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { SwapDto } from './dto/SwapDto';
import { CreateSwapDto } from './dto/CreateSwapDto';
import { SwapRepository } from './swap.repository';
import { SwapEntity } from './swap.entity';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class SwapService {
  constructor(
    public readonly swapRepository: SwapRepository,
    public readonly productRepository: ProductRepository,
  ) {}

  async saveSwapRequest(
    user: UserEntity,
    createSwapDto: CreateSwapDto,
  ): Promise<Promise<SwapEntity> | BadRequestException> {

    const validSenderProduct = await this.productRepository.findValidUserProduct(user.id,createSwapDto.senderProduct)
    if (!validSenderProduct){
        return new BadRequestException('Invalid sender product')
    }
    const validReceiverProduct = await this.productRepository.findValidUserProduct(createSwapDto.receiver,createSwapDto.receiverProduct)
    if (!validReceiverProduct){
      return new BadRequestException('Invalid receiver product')
    }

    const swapModel = await this.swapRepository.create({
      ...createSwapDto,
      sender: user.id
    });
    return  await this.swapRepository.save(swapModel);
  }

  async getSwapNotifications(user: UserEntity){
      return  await this.swapRepository.getNotificationsCount(user.id)
  }

}
