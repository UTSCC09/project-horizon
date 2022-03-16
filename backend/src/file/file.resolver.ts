import { Injectable } from '@nestjs/common';
import { Args, Query } from '@nestjs/graphql';
import { File } from 'src/entities/file.entity';
import { FileService } from './file.service';


@Injectable()
export class FileResolver {
	constructor(private readonly fileService: FileService) { }

	@Query(() => [File])
	async postFiles(@Args('postId') postId: string) {
		return await this.fileService.postFiles(postId);
	}
}
