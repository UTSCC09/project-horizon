import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';


@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [],
  providers: [PostResolver, PostService],
})
export class PostModule {}
