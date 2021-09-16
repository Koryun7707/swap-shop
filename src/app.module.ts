import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './product/product.module';
import { MessageModule } from './message/message.module';
import { SwapModule } from './swap/swap.module';
import { AppGateway } from './gateway/app.gateway';
import { SaveProductModule } from './saveProduct/saveProduct.module';
import { join } from 'path';
import { ConfigService } from './shared/services/config.service';
import { DatabaseConfig } from './common/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, `../.${process.env.NODE_ENV}.env`),
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => configService.typeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot(DatabaseConfig),
    AuthModule,
    UserModule,
    MailModule,
    SharedModule,
    ProductModule,
    MessageModule,
    SwapModule,
    SaveProductModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
