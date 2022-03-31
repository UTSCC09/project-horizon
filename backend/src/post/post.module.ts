import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/entities/post.entity';
import { File } from 'src/entities/file.entity';
import { FileModule } from 'src/file/file.module';
import { UserModule } from 'src/user/user.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { FileResolver } from 'src/file/file.resolver';

import { RedisModule } from 'src/redis/redis.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AuthModule,
    FileModule,
    UserModule,
    RedisModule,
  ],
  controllers: [],
  providers: [PostResolver, PostService, FileResolver],
  exports: [PostService],
})
export class PostModule {}
