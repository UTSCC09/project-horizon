import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { File } from 'src/entities/file.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { FileService } from './file.service';


@Resolver(() => File)
@UseGuards(GqlAuthGuard)
export class FileResolver {
	constructor(private readonly fileService: FileService) { }

	@Query(() => File)
	async file(@Args('id') id: string) {
		return this.fileService.findOne(id);
	}

	@ResolveField(() => String)
	async url(@Parent() file: File) {
		return this.fileService.getUrl(file).replace('/tmp/', '');
	}
}
