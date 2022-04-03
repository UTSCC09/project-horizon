import { Module } from '@nestjs/common';
import { RedisModule } from 'src/redis/redis.module';
import { BlacklistService } from './blacklist.service';

@Module({
  imports: [RedisModule],
  providers: [BlacklistService],
  exports: [BlacklistService],
})
export class BlacklistModule {}
