import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Post } from 'src/entities/post.entity';
import { FileModule } from 'src/file/file.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';


@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, FileModule],
  controllers: [],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}
