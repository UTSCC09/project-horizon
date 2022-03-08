import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly repo: Repository<File>,
  ) {}

  fileType(file: File): string {
    return file.filename.split('.').pop();
  }

  async upload(file: FileUpload): Promise<File> {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.mimetype = file.mimetype;
    newFile.encoding = file.encoding;
    newFile.size = file.size;

    file.createReadStream().pipe(createWriteStream(`./uploads/${newFile.id}.${this.fileType(newFile)}`));

    return this.repo.save(newFile);
  }
}
