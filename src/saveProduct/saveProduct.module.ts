import { Module } from '@nestjs/common';
import { SaveProductService } from './saveProduct.service';
import { SaveProductController } from './saveProduct.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveProductRepository } from './saveProduct.repository';
import { ProductRepository } from '../product/product.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SaveProductRepository,
      ProductRepository,
      UserRepository,
    ]),
  ],
  providers: [SaveProductService],
  controllers: [SaveProductController],
})
export class SaveProductModule {}
