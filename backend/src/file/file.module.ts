import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FileResolver } from './file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService, FileResolver],
  exports: [FileService, FileResolver],
})
export class FileModule {}
