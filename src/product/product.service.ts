import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { ProductRepository } from './product.repository';
import { IFile } from '../interfaces/IFile';
import { AwsS3Service } from '../shared/services/aws-s3.service';
import { Brackets } from 'typeorm';
import { UserRepository } from '../user/user.repository';
import { ProductEntity } from './product.entity';
import { UpdateProductDto } from './dto/UpdateProductDto';

@Injectable()
export class ProductService {
  constructor(
    public readonly productRepository: ProductRepository,
    public readonly userRepository: UserRepository,
    public readonly awsS3Service: AwsS3Service,
  ) {}

  async findProductById(productId: string): Promise<ProductEntity | undefined> {
    return await this.productRepository.findOne({ id: productId });
  }

  async uploadProduct(
    user: UserEntity,
    uploadProductDto: UploadProductDto,
  ): Promise<ProductDto> {
    let imagesModel: string[];
    if (uploadProductDto.images && uploadProductDto.images.length) {
      imagesModel = await Promise.all(
        uploadProductDto.images.map(async (file): Promise<string> => {
          return await this.awsS3Service.uploadImage(file, user);
        }),
      );
    }
    const productModel = await this.productRepository.create({
      ...uploadProductDto,
      user: user.id,
      images: imagesModel,
    });
    const product = await this.productRepository.save(productModel);
    return product.toDto();
  }
  async updateProduct(
    user: UserEntity,
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException();
    }
    let imagesModel: string[];
    if (updateProductDto.images.length) {
      imagesModel = await Promise.all(
        updateProductDto.images.map(async (file): Promise<string> => {
          return await this.awsS3Service.uploadImage(file, user);
        }),
      );
    }
    if (imagesModel && imagesModel.length) {
      updateProductDto.images = imagesModel;
    }
    await this.productRepository.update(id, updateProductDto);
    const updateProduct = await this.productRepository.findOne(id);

    return updateProduct.toDto();
  }
  async getProducts(user: UserEntity): Promise<ProductDto[]> {
    const productsModel = await this.productRepository
      .createQueryBuilder('product')
      .where('product.user = :userId', { userId: user.id })
      .leftJoinAndSelect('product.user', 'user')
      .select(['product', 'user.profilePicture', 'user.id', 'user.firstName']);
    const result = await productsModel.getMany();

    return result.map((product) => product.toDto());
  }
  async getAllProducts(user: UserEntity): Promise<ProductDto[]> {
    return this._getNonBlockUsersProducts(user);
  }
  async deleteProduct(user: UserEntity, id: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: {
        user: user.id,
        id,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    if (product.images && product.images.length) {
      await Promise.all(
        product.images.map(async (file): Promise<void> => {
          return await this.awsS3Service.deleteFile(file);
        }),
      );
    }
    await this.productRepository.delete(id);
  }

  async searchProduct(
    user: UserEntity,
    search?: string,
  ): Promise<ProductDto[]> {
    search = search.toLowerCase();
    const product = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .select(['product', 'user.profilePicture', 'user.id', 'user.firstName'])
      .where(
        new Brackets((qb) => {
          qb.where(
            'LOWER(product.name) like :name OR LOWER(product.brandName) like :brandName OR LOWER(product.size) like :size OR LOWER(product.color) like :color',
            {
              name: `%${search}%`,
              brandName: `%${search}%`,
              size: `%${search}%`,
              color: `%${search}%`,
            },
          );
        }),
      )
      .andWhere('product.user != :userId', { userId: user.id });
    const result = await product.getMany();
    console.log(result,111);
    return result.map((item) => item.toDto());
  }
  private async _getNonBlockUsersProducts(
    user: UserEntity,
  ): Promise<ProductDto[]> {
    const userModel = await this.userRepository.findOne({ id: user.id });
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.user', 'user')
      .select(['product', 'user.profilePicture', 'user.id', 'user.firstName']);
    if (userModel.blockedBy && userModel.blockedBy.length) {
      product.where('product.user NOT IN (:...blockedBy)', {
        blockedBy: userModel.blockedBy,
      });
    }
    if (userModel.blocked && userModel.blocked.length) {
      product.andWhere('product.user NOT IN (:...blocked)', {
        blocked: userModel.blocked,
      });
    }
    const result = await product.getMany();

    return result.map((item) => item.toDto());
  }
}
