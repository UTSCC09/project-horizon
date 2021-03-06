import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Comment } from 'src/entities/comment.entity';
import { RedisModule } from 'src/redis/redis.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), AuthModule, RedisModule, PostModule],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
