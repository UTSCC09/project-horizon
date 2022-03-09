import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/entities/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';


@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule],
  controllers: [],
  providers: [PostResolver, PostService],
})
export class PostModule {}
