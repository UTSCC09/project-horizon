import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { FileResolver } from './file.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  providers: [FileService, FileResolver],
})
export class FileModule {}
