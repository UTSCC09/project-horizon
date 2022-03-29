import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
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

	@Mutation(() => User)
	async followUser(
		@RequestUser() user: User,
		@Args('userId') userId: number,
	): Promise<User> {
		user = await this.userService.findOne(user.id);
		return await this.userService.followUser(user, userId);
	}

	@Mutation(() => User)
	async unfollowUser(
		@RequestUser() user: User,
		@Args('userId') userId: number,
	): Promise<User> {
		user = await this.userService.findOne(user.id);
		return await this.userService.unfollowUser(user, userId);
	}

	@ResolveField()
	async following(@Parent() user: User): Promise<User[]> {
		user = await this.userService.findOne(user.id, { relations: ['following'] });
		return user.following;
	}

	@ResolveField()
	async followers(@Parent() user: User): Promise<User[]> {
		user = await this.userService.findOne(user.id, { relations: ['followers'] });
		return user.followers;
	}

	@ResolveField()
	async followingCount(@Parent() user: User): Promise<number> {
		user = await this.userService.findOne(user.id, { relations: ['following'] });
		return user.following?.length || 0;
	}

	@ResolveField()
	async followersCount(@Parent() user: User): Promise<number> {
		user = await this.userService.findOne(user.id, { relations: ['followers'] });
		return user.followers?.length || 0;
	}

	@ResolveField()
	async postsCount(@Parent() user: User): Promise<number> {
		user = await this.userService.findOne(user.id, { relations: ['posts'] });
		return user.posts?.length || 0;
	}

	@ResolveField()
	async isFollowing(
		@Parent() user: User,
		@RequestUser() requestUser: User,
	): Promise<boolean> {
		requestUser = await this.userService.findOne(requestUser.id, { relations: ['following'] });
		return requestUser.following.some(f => f.id === user.id);
	}

}
