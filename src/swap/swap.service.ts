import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateSwapDto } from './dto/CreateSwapDto';
import { SwapRepository } from './swap.repository';
import { SwapEntity } from './swap.entity';
import { ProductRepository } from '../product/product.repository';
import { ApprovedSwapDto } from './dto/ApprovedSwapDto';
import { Not } from 'typeorm';
import { SwapStatusesEnum } from '../enums/swap-statuses.enum';
import { ProductStatusEnum } from '../enums/product-status.enum';
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

  async getSwapNotifications(user: UserEntity) {
    return await this.swapRepository
      .createQueryBuilder('swap')
      .where('swap.receiver = :userId and swap.status = :status', {
        userId: user.id,
        status: SwapStatusesEnum.NEW,
      })
      .select(['swap', '_sender.firstName', '_sender.profilePicture'])
      .leftJoin('swap.sender', '_sender')
      .getMany();
  }

  async deleteSwapRequest(user: UserEntity, id: string): Promise<object> {
    try {
      return await this.swapRepository
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
  ): Promise<object> {
    const swapRequest = await this.swapRepository.findOne({
      where: { id: approvedSwapDto.id, status: Not(SwapStatusesEnum.APPROVED) },
      relations: ['senderProduct', 'receiverProduct'],
    });

    if (swapRequest) {
      try {
        swapRequest.status = SwapStatusesEnum.APPROVED;
        swapRequest.dropOff = [approvedSwapDto.dropOff];

        await this.swapRepository.save(swapRequest);

        const senderProduct = swapRequest.senderProduct['id'];
        const receiverProduct = swapRequest.receiverProduct['id'];

        return await this.productRepository
          .createQueryBuilder('product')
          .update()
          .set({
            status: ProductStatusEnum.SWAPPED,
          })
          .where(
            'product.id = :senderProduct or product.id = :receiverProduct',
            { senderProduct: senderProduct, receiverProduct: receiverProduct },
          )
          .execute();
      } catch (e) {
        throw BadRequestException;
      }
    }

    return { message: 'Swap Request Not Found' };
  }

  async getApprovedNotifications(
    user: UserEntity,
    approvedSwapNotificationsDto: ApprovedSwapNotificationsDto,
  ): Promise<object> {
    const approvedSwapNotificationsQuery = await this.swapRepository
      .createQueryBuilder('swap')
      .where('(swap.receiver = :receiver and swap.sender = :sender)')
      .orWhere('(swap.sender = :receiver and swap.receiver = :sender)')
      .setParameters({
        receiver: approvedSwapNotificationsDto.receiver,
        sender: approvedSwapNotificationsDto.sender,
      })
      .orderBy('swap.updatedAt', 'DESC');

    const totalCount = await approvedSwapNotificationsQuery.getCount();
    const approvedSwapNotifications = await approvedSwapNotificationsQuery
      .offset(approvedSwapNotificationsDto.offset)
      .limit(approvedSwapNotificationsDto.limit)
      .getMany();

    return {
      statusCode: 200,
      rows: approvedSwapNotifications.map((item) => item.toDto()),
      totalCount: totalCount,
    };
  }

  async makeSeenNotification(user: UserEntity, uuid: string): Promise<object> {
    return await this.swapRepository
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
      swap.senderProduct.length === idsSenderProduct.length &&
      swap.receiverProduct.length === idsReceiverProduct.length
    ) {
      return true;
    }
    return false;
  }
}
