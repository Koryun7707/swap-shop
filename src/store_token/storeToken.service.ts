import { Injectable, NotFoundException } from '@nestjs/common';
import { StoreTokenRepository } from './storeToken.repository';
import { UserEntity } from '../user/user.entity';
import { CreateStoreTokenDto } from './dto/CreateStoreTokenDto';
import { StoreTokenDto } from './dto/StoreTokenDto';
import { StoreTokenEntity } from './storeToken.entity';
import fetch from 'node-fetch';

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
  async sendFirebaseNotification(
    user: UserEntity,
    bodyText: string,
    title,
    type,
    groupId = null,
  ) {
    const storeToken = await this.storeTokenRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!storeToken) {
      throw new NotFoundException('storeToken');
    }
    const notification = {
      title: title,
      body: bodyText,
    };
    const key = process.env.FIREBASE_SERVER_KEY;
    const url = process.env.FIREBASE_FCM_URL;
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'key=' + key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification: notification,
        to: storeToken.token,
        data: {
          bodyText,
          type,
          groupId,
          user
        },
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
