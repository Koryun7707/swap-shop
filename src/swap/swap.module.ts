import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '../product/product.repository';
import { SwapRepository } from './swap.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository,SwapRepository])],
  controllers: [SwapController],
  providers: [SwapService]
})
export class SwapModule {}
