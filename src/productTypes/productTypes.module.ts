import { Module } from '@nestjs/common';
import { ProductTypesService } from './productTypes.service';
import { ProductTypesController } from './productTypes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductTypesRepository } from './productTypes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypesRepository])],
  providers: [ProductTypesService],
  controllers: [ProductTypesController],
})
export class ProductTypesModule {}
