import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = new Redis({
      port: parseInt(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    });
  }

  getClient() {
    return this.client;
  }
}
