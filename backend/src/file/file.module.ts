import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FileResolver } from './file.resolver';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService, FileResolver],
  exports: [FileService, FileResolver],
  controllers: [FileController],
})
export class FileModule {}
