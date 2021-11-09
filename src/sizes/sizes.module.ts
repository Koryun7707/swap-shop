import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizesService } from './sizes.service';
import { SizesController } from './sizes.controller';
import { SizesRepository } from './sizes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SizesRepository])],
  providers: [SizesService],
  controllers: [SizesController],
})
export class SizesModule {}
