import { Module } from '@nestjs/common';
import { SwapService } from './swap.service';
import { SwapController } from './swap.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '../product/product.repository';
import { SwapRepository } from './swap.repository';
import { SwapExistValidation } from '../common/validators/swap-exist.validation';
import { StoreTokenService } from '../store_token/storeToken.service';
import { StoreTokenRepository } from '../store_token/storeToken.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      SwapRepository,
      StoreTokenRepository,
      UserRepository,
    ]),
  ],
  controllers: [SwapController],
  providers: [SwapService, SwapExistValidation, StoreTokenService],
})
export class SwapModule {}
