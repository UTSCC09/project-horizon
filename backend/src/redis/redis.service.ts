import { Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private _subscriber = null;
  private _publisher = null;
  private _db = null;

  constructor() {}

  existsOrCreate(connection) {
    if (connection == null) {
      connection = new Redis({
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
      });
    }

    return connection;
  }

  get db() {
    this._db = this.existsOrCreate(this._db);
    return this._db;
  }

  get subscriber() {
    this._subscriber = this.existsOrCreate(this._subscriber);
    return this._subscriber;
  }

  get publisher() {
    this._publisher = this.existsOrCreate(this._publisher);
    return this._publisher;
  }
}
