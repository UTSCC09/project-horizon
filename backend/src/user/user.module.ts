import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PostModule } from 'src/post/post.module';
import { RedisModule } from 'src/redis/redis.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule { }
