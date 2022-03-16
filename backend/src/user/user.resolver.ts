import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { UserService } from './user.service';


@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
	constructor(private readonly userService: UserService) { }

	@Query(() => User)
	async user(@Args('id') id: number) {
		return this.userService.findOne(id);
	}

	@ResolveField()
	async posts(@Parent() user: User) {
		user = await this.userService.findOne(user.id, { relations: ['posts'] });
		return user.posts;
	}

	@ResolveField()
	async files(@Parent() user: User) {
		user = await this.userService.findOne(user.id, { relations: ['files'] });
		return user.files;
	}

}
