import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsRepository } from './brands.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BrandsRepository])],
  providers: [BrandsService],
  controllers: [BrandsController],
})
export class BrandsModule {}
