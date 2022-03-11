import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { FileResolver } from './file.resolver';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  providers: [FileService, FileResolver],
})
export class FileModule {}
