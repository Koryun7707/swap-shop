import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/user.entity';
import { MailModule } from './mail/mail.module';
import { SharedModule } from './shared/shared.module';
import { ProductModule } from './product/product.module';
import { MessageModule } from './message/message.module';
import { SwapModule } from './swap/swap.module';
import { AppGateway } from './gateway/app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true, // no need to import into other modules
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    UserModule,
    MailModule,
    SharedModule,
    ProductModule,
    MessageModule,
    SwapModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
