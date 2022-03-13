import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { User } from 'src/entities/user.entity';
import { PostService } from 'src/post/post.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly repo: Repository<File>,
    private readonly postService: PostService,
  ) {}

  fileType(file: File): string {
    return file.filename.split('.').pop();
  }

  async upload(file: FileUpload, user: User, postId: string): Promise<File> {
    const newFile = new File();
    newFile.filename = file.filename;
    newFile.mimetype = file.mimetype;
    newFile.encoding = file.encoding;
    newFile.user = user;
    newFile.post = await this.postService.findOne(postId);
    const res = await this.repo.save(newFile);

    file.createReadStream().pipe(createWriteStream(`./uploads/${res.id}.${this.fileType(newFile)}`));

    return res;
  }
}
