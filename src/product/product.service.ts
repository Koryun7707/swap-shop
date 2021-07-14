import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UploadProductDto } from './dto/UploadProductDto';
import { ProductDto } from './dto/ProductDto';
import { ProductRepository } from './product.repository';
import { IFile } from '../interfaces/IFile';
import { ValidatorService } from '../shared/services/validator.service';
import { FileNotImageException } from '../exceptions/file-not-image.exception';
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
    const images = [];
    if (files.length) {
      files.map(async (file) => {
        if (!file || !ValidatorService.isImage(file.mimetype)) {
          throw new FileNotImageException();
        }
        const path = await this.awsS3Service.uploadImage(file);
        images.push(path);
      });
    }
    const productModel = await this.productRepository.create({
      ...uploadProductDto,
      userId: user.id,
      images,
    });
    const product = await this.productRepository.save(productModel);
    return product.toDto();
  }
}
