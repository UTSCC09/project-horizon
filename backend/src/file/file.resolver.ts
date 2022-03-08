import { Injectable } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
// https://stephen-knutter.github.io/2020-02-07-nestjs-graphql-file-upload/

@Injectable()
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
  ) {}

  @Mutation(() => File)
  async uploadFile(
    @Args({name: 'file', type: () => GraphQLUpload}) file: FileUpload,
    ): Promise<File> {
      return await this.fileService.upload(file);
  }
}
