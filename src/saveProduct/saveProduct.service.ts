import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { CreateSaveProductDto } from './dto/CreateSaveProductDto';
import { SaveProductDto } from './dto/SaveProductDto';
import { ProductRepository } from '../product/product.repository';
import { SaveProductRepository } from './saveProduct.repository';

@Injectable()
export class SaveProductService {
  constructor(
    public readonly productRepository: ProductRepository,
    public readonly saveProductRepository: SaveProductRepository,
  ) {}
  async saveProduct(
    user: UserEntity,
    createSaveProductDto: CreateSaveProductDto,
  ): Promise<SaveProductDto> {
    const product = await this.productRepository.findOne({
      where: {
        id: createSaveProductDto.productId,
      },
    });
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
    const saveProducts = await this.saveProductRepository.find({
      where: {
        user,
      },
      relations: ['user', 'product'],
    });
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
}
