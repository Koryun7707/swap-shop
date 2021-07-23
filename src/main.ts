import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as RateLimit from 'express-rate-limit';
import { setupSwagger } from './viveo-swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      dismissDefaultMessages: false,
      validationError: {
        target: false,
      },
    }),
  );
  setupSwagger(app);
  await app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
  });
}
void bootstrap();
