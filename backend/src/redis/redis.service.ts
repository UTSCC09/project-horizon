import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private _subscriber;
  private _publisher;

  constructor() {
    // Connection intended to be put into subscriber mode
    this._subscriber = new Redis({
      port: parseInt(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    });

    // Connection intended to be put into publisher mode
    this._publisher = new Redis({
      port: parseInt(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
    });
  }

  get subscriber() {
    return this._subscriber;
  }

  get publisher() {
    return this._publisher;
  }
}
