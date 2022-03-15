import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
