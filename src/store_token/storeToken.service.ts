import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreTokenRepository } from './storeToken.repository';
import { UserEntity } from '../user/user.entity';
import { CreateStoreTokenDto } from './dto/CreateStoreTokenDto';
import { StoreTokenDto } from './dto/StoreTokenDto';
import { StoreTokenEntity } from './storeToken.entity';
import fetch from 'node-fetch';
import * as path from 'path';
import * as dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

@Injectable()
export class StoreTokenService {
  constructor(public readonly storeTokenRepository: StoreTokenRepository) {}
  async createOrUpdate(
    user: UserEntity,
    createStoreTokenDto: CreateStoreTokenDto,
  ): Promise<StoreTokenDto> {
    let storeToken = await this.storeTokenRepository.findOne({
      userId: user.id,
    });
    if (!storeToken) {
      const newStoreToken = new StoreTokenEntity();
      newStoreToken.userId = user.id;
      newStoreToken.token = createStoreTokenDto.token;
      storeToken = await this.storeTokenRepository.save(newStoreToken);
    } else {
      storeToken.token = createStoreTokenDto.token;
      storeToken = await this.storeTokenRepository.save(storeToken);
    }

    return storeToken;
  }
  async sendFirebaseNotification(user: UserEntity, bodyText: string, type) {
    const storeToken = await this.storeTokenRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!storeToken) {
      throw new NotFoundException('storeToken');
    }
    const key = process.env.FIREBASE_SERVER_KEY;
    const url = process.env.FIREBASE_FCM_URL;
    console.log(url,1111);
    const notification = {
      title: type,
      body: bodyText,
    };
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'key=' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification: notification,
        to: storeToken.token,
        bodyText,
      }),
    })
      .then(async function (response) {
        response = await response.json();
        console.log(response);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
