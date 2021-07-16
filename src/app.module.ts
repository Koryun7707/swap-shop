import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './product/product.module';
import { ConfigService } from './shared/services/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    MailModule,
    SharedModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
