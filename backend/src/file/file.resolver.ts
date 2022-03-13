import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FileService } from './file.service';
import { File } from '../entities/file.entity';
import { RequestUser } from 'src/auth/jwt.strategy';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

// https://stephen-knutter.github.io/2020-02-07-nestjs-graphql-file-upload/

@Injectable()
@UseGuards(GqlAuthGuard)
export class FileResolver {
  constructor(
    private readonly fileService: FileService,
  ) {}

  @Mutation(() => File)
  async uploadFile(
    @Args({name: 'file', type: () => GraphQLUpload}) file: FileUpload,
    @Args('postId') postId: string,
    @RequestUser() user: User,
    ): Promise<File> {
      return await this.fileService.upload(file, user, postId);
  }
}
