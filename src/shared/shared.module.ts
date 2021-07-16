import { Global, HttpModule, Module } from '@nestjs/common';

import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { ValidatorService } from './services/validator.service';
import { ConfigService } from './services/config.service';

const providers = [
  ValidatorService,
  AwsS3Service,
  GeneratorService,
  ConfigService,
];

@Global()
@Module({
  providers,
  imports: [HttpModule],
  exports: [...providers, HttpModule],
})
export class SharedModule {}
