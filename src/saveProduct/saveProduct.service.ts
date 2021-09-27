import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateSaveProductDto } from './dto/CreateSaveProductDto';
import { SaveProductDto } from './dto/SaveProductDto';
import { ProductRepository } from '../product/product.repository';
import { SaveProductRepository } from './saveProduct.repository';
import { UserRepository } from '../user/user.repository';
import { ProductStatusEnum } from "../enums/product-status.enum";

@Injectable()
export class SaveProductService {
  constructor(
    public readonly productRepository: ProductRepository,
    public readonly saveProductRepository: SaveProductRepository,
    public readonly userRepository: UserRepository,
  ) {}
  async saveProduct(
    user: UserEntity,
    createSaveProductDto: CreateSaveProductDto,
  ): Promise<SaveProductDto> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', {
        id: createSaveProductDto.productId,
      })
      .leftJoinAndSelect('product.user', 'user')
      .andWhere(
        '((NOT (user.blockedBy @> ARRAY[:blockedBy]::text[])) or (user.blockedBy is null) )',
        {
          blockedBy: user.id,
        },
      )
      .andWhere(
        '((NOT (user.blocked @> ARRAY[:blocked]::text[])) or (user.blockedBy is null ) )',
        {
          blocked: user.id,
        },
      )
      .getOne();
    if (!product) {
      throw new NotFoundException();
    }
    const checkSaveProduct = await this.saveProductRepository.findOne({
      where: {
        user,
        product,
      },
    });
    if (checkSaveProduct) {
      throw new ConflictException();
    }
    const saveProductModel = await this.saveProductRepository.create({
      user,
      product,
    });
    const saveProduct = await this.saveProductRepository.save(saveProductModel);
    return saveProduct.toDto();
  }
  async getSaveProducts(user: UserEntity): Promise<SaveProductDto[]> {
    const saveProducts = await this.saveProductRepository
      .createQueryBuilder('saveProduct')
      .where('saveProduct.user = :user', {
        user: user.id,
      })
      .leftJoinAndSelect('saveProduct.user', 'user')
      .leftJoinAndSelect('saveProduct.product', 'product')
      .andWhere(
        '((NOT (user.blockedBy @> ARRAY[:blockedBy]::text[])) or (user.blockedBy is null and user.blocked is null) )',
        {
          blockedBy: user.id,
        },
      )
      .andWhere(
        '((NOT (user.blocked @> ARRAY[:blocked]::text[])) or (user.blockedBy is null and user.blocked is null) )',
        {
          blocked: user.id,
        },
      )
      .getMany();
    return saveProducts.map((item) => item.toDto());
  }
  async deleteSaveProduct(user: UserEntity, id: string): Promise<void> {
    const saveProduct = await this.saveProductRepository.findOne({
      where: {
        id,
        user,
      },
    });
    if (!saveProduct) {
      throw new NotFoundException();
    }
    await this.saveProductRepository.delete(id);
  }
  async deleteSaveProductByProductId(
    user: UserEntity,
    productId: string,
  ): Promise<void> {
    const saveProduct = await this.saveProductRepository.findOne({
      where: {
        product: productId,
        user,
      },
    });
    if (!saveProduct) {
      throw new NotFoundException();
    }
    await this.saveProductRepository.delete({ id: saveProduct.id });
  }
}
