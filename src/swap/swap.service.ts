import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateSwapDto } from './dto/CreateSwapDto';
import { SwapRepository } from './swap.repository';
import { SwapEntity } from './swap.entity';
import { ProductRepository } from '../product/product.repository';
import { ApprovedSwapDto } from './dto/ApprovedSwapDto';
import { Not } from 'typeorm';
import { SwapStatusesEnum } from '../enums/swap-statuses.enum';
import { ApprovedSwapNotificationsDto } from './dto/ApprovedSwapNotificationsDto';

@Injectable()
export class SwapService {
  constructor(
    public readonly swapRepository: SwapRepository,
    public readonly productRepository: ProductRepository,
  ) {}

  async saveSwapRequest(
    user: UserEntity,
    createSwapDto: CreateSwapDto,
  ): Promise<SwapEntity> {
    const senderProduct = await this.productRepository.checkProductsUser(
      user.id,
      createSwapDto.senderProduct,
    );
    if (!senderProduct.length) {
      throw new BadRequestException('Invalid sender product');
    }
    const receiverProduct = await this.productRepository.checkProductsUser(
      createSwapDto.receiver,
      createSwapDto.receiverProduct,
    );
    if (!receiverProduct.length) {
      throw new BadRequestException('Invalid receiver product');
    }

    const existSwapRequest = await this._checkSwapRequestExist(
      senderProduct,
      receiverProduct,
      user,
      createSwapDto.receiver,
    );
    if (existSwapRequest) {
      throw new BadRequestException('You have already requested a swap.');
    }
    const swapModel = await this.swapRepository.create({
      ...createSwapDto,
      senderProduct,
      receiverProduct,
      sender: user.id,
    });
    return await this.swapRepository.save(swapModel);
  }

  async getNewSwapNotifications(user: UserEntity): Promise<SwapEntity[]> {
    return await this.swapRepository
      .createQueryBuilder('swap')
      .where('swap.receiver = :userId and swap.status = :status', {
        userId: user.id,
        status: SwapStatusesEnum.NEW,
      })
      .select([
        'swap',
        '_sender.firstName',
        '_sender.profilePicture',
        '_senderProduct',
        '_receiverProduct',
      ])
      .leftJoin('swap.sender', '_sender')
      .leftJoin('swap.senderProduct', '_senderProduct')
      .leftJoin('swap.receiverProduct', `_receiverProduct`)
      .getMany();
  }
  async getAll(
    user: UserEntity,
    approvedSwapNotificationsDto: ApprovedSwapNotificationsDto,
  ): Promise<SwapEntity[]> {
    return await this.swapRepository
      .createQueryBuilder('swap')
      .where('swap.receiver = :userId or swap.sender = :userId', {
        userId: user.id,
      })
      .select([
        'swap',
        '_sender.firstName',
        '_sender.profilePicture',
        '_senderProduct',
        '_receiverProduct',
      ])
      .leftJoin('swap.sender', '_sender')
      .leftJoin('swap.senderProduct', '_senderProduct')
      .leftJoin('swap.receiverProduct', `_receiverProduct`)
      .offset(approvedSwapNotificationsDto?.offset || 0)
      .limit(approvedSwapNotificationsDto?.limit || 10)
      .getMany();
  }

  async deleteSwapRequest(user: UserEntity, id: string): Promise<void> {
    try {
      await this.swapRepository
        .createQueryBuilder('swap')
        .delete()
        .where('(swap.sender = :userId OR swap.receiver = :userId)', {
          userId: user.id,
        })
        .andWhere('swap.id = :swapId', { swapId: id })
        .execute();
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async approveSwapRequest(
    user: UserEntity,
    approvedSwapDto: ApprovedSwapDto,
  ): Promise<SwapEntity> {
    const swapRequest = await this.swapRepository.findOne({
      where: { id: approvedSwapDto.id, status: Not(SwapStatusesEnum.APPROVED) },
      relations: ['senderProduct', 'receiverProduct'],
    });
    if (!swapRequest) {
      throw new BadRequestException('Swap request approved');
    }
    const product = await this.productRepository.findOne({
      where: {
        id: approvedSwapDto.productId,
      },
    });
    if (!product) {
      throw new NotFoundException('product');
    }
    swapRequest.status = SwapStatusesEnum.APPROVED;
    swapRequest.dropOff = [approvedSwapDto.dropOff];
    swapRequest.senderProduct = [product];
    return await this.swapRepository.save(swapRequest);
  }

  async getApprovedNotifications(
    user: UserEntity,
    approvedSwapNotificationsDto: ApprovedSwapNotificationsDto,
  ): Promise<{ swaps: SwapEntity[]; totalCount: number }> {
    const approvedSwapNotificationsQuery = await this.swapRepository
      .createQueryBuilder('swap')
      .where('(swap.receiver = :receiver and swap.sender = :sender)')
      .orWhere('(swap.sender = :receiver and swap.receiver = :sender)')
      .setParameters({
        receiver: approvedSwapNotificationsDto.receiver,
        sender: user.id,
      })
      .orderBy('swap.updatedAt', 'DESC');

    const totalCount = await approvedSwapNotificationsQuery.getCount();
    const approvedSwapNotifications = await approvedSwapNotificationsQuery
      .offset(approvedSwapNotificationsDto.offset)
      .limit(approvedSwapNotificationsDto.limit)
      .getMany();

    return {
      swaps: approvedSwapNotifications.map((item) => item.toDto()),
      totalCount: totalCount,
    };
  }

  async makeSeenNotification(
    user: UserEntity,
    uuid: string,
  ): Promise<SwapEntity> {
    const swap = await this.swapRepository.findOne({
      where: {
        id: uuid,
      },
    });
    if (!swap) {
      throw new NotFoundException('swap request');
    }
    await this.swapRepository
      .createQueryBuilder('swap')
      .update()
      .set({
        status: SwapStatusesEnum.SEEN,
      })
      .where(
        'swap.id = :uuid and swap.receiver = :receiverId and swap.status = :status',
        { uuid, receiverId: user.id, status: SwapStatusesEnum.NEW },
      )
      .execute();
    return await this.swapRepository.findOne({
      where: {
        id: uuid,
      },
      relations: ['senderProduct', 'receiverProduct'],
    });
  }
  private async _checkSwapRequestExist(
    senderProduct,
    receiverProduct,
    user: UserEntity,
    receiver: string,
  ): Promise<boolean> {
    const idsReceiverProduct: Array<string> = [];
    const idsSenderProduct: Array<string> = [];
    senderProduct.forEach((item) => {
      idsSenderProduct.push(item.id);
    });
    receiverProduct.forEach((item) => {
      idsReceiverProduct.push(item.id);
    });
    const swap = await this.swapRepository
      .createQueryBuilder('swap')
      .where('swap.receiver = :receiver and swap.sender = :sender', {
        receiver: receiver,
        sender: user.id,
      })
      .select(['swap', '_senderProduct.id', '_receiverProduct.id'])
      .leftJoin('swap.senderProduct', '_senderProduct')
      .leftJoin('swap.receiverProduct', '_receiverProduct')
      .andWhere('_receiverProduct.id IN (:...receiverProduct)', {
        receiverProduct: idsReceiverProduct,
      })
      .andWhere('_senderProduct.id IN (:...senderProduct)', {
        senderProduct: idsSenderProduct,
      })
      .getOne();
    if (
      swap &&
      swap.senderProduct.length === idsSenderProduct.length &&
      swap.receiverProduct.length === idsReceiverProduct.length
    ) {
      return true;
    }
    return false;
  }
}
