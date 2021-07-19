import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { ProductRepository } from './product.repository';
import { IFile } from '../interfaces/IFile';
import { AwsS3Service } from '../shared/services/aws-s3.service';
import { Brackets } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    public readonly productRepository: ProductRepository,
    public readonly awsS3Service: AwsS3Service,
  ) {}
  async uploadProduct(
    user: UserEntity,
    uploadProductDto: UploadProductDto,
    files: Array<IFile>,
  ): Promise<ProductDto> {
    let images: string[];
    if (files.length) {
      images = await Promise.all(
        files.map(async (file): Promise<string> => {
          return await this.awsS3Service.uploadImage(file);
        }),
      );
    }
    const productModel = await this.productRepository.create({
      ...uploadProductDto,
      user: user.id,
      images,
    });
    const product = await this.productRepository.save(productModel);
    return product.toDto();
  }
  async getProducts(user: UserEntity): Promise<ProductDto[]> {
    const productsModel = await this.productRepository.find({
      where: {
        user: user.id,
      },
      relations: ['user'],
    });
    return productsModel.map((product) => product.toDto());
  }
  async getAllProducts(): Promise<ProductDto[]> {
    const productsModel = await this.productRepository.find();
    return productsModel.map((product) => product.toDto());
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
    return result.map((item) => item.toDto());
  }
}
