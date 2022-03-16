import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { User } from 'src/entities/user.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly repo: Repository<File>,
  ) {}

  fileType(file: File): string {
    return file.filename.split('.').pop();
  }

  async findAll(options: FindManyOptions): Promise<File[]> {
    return this.repo.find(options);
  }

  async postFiles(postId: string): Promise<File[]> {
    return this.repo.find({ where: { post: {id: postId} } });
  }

  async upload(file: FileUpload, user: User): Promise<File> {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.mimetype = file.mimetype;
    newFile.encoding = file.encoding;
    newFile.user = user;
    const res = await this.repo.save(newFile);

    file.createReadStream().pipe(createWriteStream(`./uploads/${res.id}.${this.fileType(newFile)}`));

    return res;
  }
}
