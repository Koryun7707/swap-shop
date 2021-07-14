import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { ProductRepository } from './product.repository';
import { IFile } from '../interfaces/IFile';
import { AwsS3Service } from '../shared/services/aws-s3.service';

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
      userId: user.id,
      images,
    });
    const product = await this.productRepository.save(productModel);
    return product.toDto();
  }
  async getProducts(user: UserEntity): Promise<ProductDto[]> {
    const productsModel = await this.productRepository.find({
      where: {
        userId: user.id,
      },
    });
    return productsModel.map((product) => product.toDto());
  }
}
