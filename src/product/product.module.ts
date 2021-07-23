import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';
import { UserRepository } from '../user/user.repository';
import { ProductExistsRule } from '../common/validators/product-exist.validation';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository, UserRepository])],
  providers: [ProductService,ProductExistsRule],
  controllers: [ProductController],
})
export class ProductModule {}
