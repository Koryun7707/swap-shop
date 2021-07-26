import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as mime from 'mime-types';

import { IFile } from '../../interfaces/IFile';
import { GeneratorService } from './generator.service';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class AwsS3Service {
  private readonly _s3: AWS.S3;
  constructor(public generatorService: GeneratorService) {
    const options: AWS.S3.Types.ClientConfiguration = {
      apiVersion: '2010-12-01',
      region: 'eu-west-2',
    };
    const awsS3Config = {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      bucketName: process.env.S3_BUCKET_NAME,
      baseUrl: process.env.S3_BASELINK,
    };
    if (awsS3Config.accessKeyId && awsS3Config.secretAccessKey) {
      options.credentials = awsS3Config;
    }
    this._s3 = new AWS.S3(options);
  }

  async uploadImage(file: string, user: UserEntity): Promise<string> {
    // const fileName = this.generatorService.fileName(
    //   <string>mime.extension(file.mimetype),
    // );
    // const key = `images/${fileName}`;
    const buf = Buffer.from(
      file.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    await this._s3
      .putObject({
        ContentEncoding: 'base64',
        Bucket: process.env.S3_BUCKET_NAME,
        Body: buf,
        ACL: 'public-read',
        Key: user.id,
        ContentType: 'image/jpeg',
      })
      .promise();
    return `${process.env.S3_BASELINK}${user.id}`;
  }

  // async uploadFile(file: IFile): Promise<string> {
  //   const fileName = this.generatorService.fileName(
  //     <string>mime.extension(file.mimetype),
  //   );
  //   const key = `${file.mimetype}/${fileName}`;
  //   await this._s3
  //     .putObject({
  //       Bucket: this.configService.awsS3Config.bucketName,
  //       Body: file.buffer,
  //       ACL: 'public-read',
  //       Key: key,
  //       ContentType: file.mimetype,
  //     })
  //     .promise();
  //   return `${this.configService.baseLink}${key}`;
  // }
  //
  async deleteFile(path: string): Promise<void> {
    const key = path.replace(process.env.S3_BASELINK, '');
    await this._s3
      .deleteObject(
        {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: key,
        },
        (err) => (err ? Logger.error(err, 'AWS S3 Delete ERROR') : null),
      )
      .promise();
  }
}
