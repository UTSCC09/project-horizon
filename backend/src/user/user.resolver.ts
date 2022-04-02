import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
import { User, Notification } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { RedisService } from 'src/redis/redis.service';
import { UserService } from './user.service';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
	private subscriber;

	constructor(
		private readonly userService: UserService,
		private readonly redis: RedisService,
	) {
		this.subscriber = this.redis.subscriber;
	}

	@Query(() => User)
	async user(@Args('id') id: number) {
		return this.userService.findOne(id);
	}

	@Query(() => Notification)
	async notifications(@RequestUser() user: User) {
		this.subscriber.subscribe(`notifications:${user.id}`, (err, count) => {
			if (err) {
				//  return 500
				throw new HttpException(
					'Failed to subscribe to notifications',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			if (count == 0) {
				throw new HttpException(
					'Failed to subscribe to notifications channel',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}

			console.log(`subscribed to notifications:${user.id} ${count} channels`);
		});

		return await new Promise((resolve, reject) => {
			this.subscriber.on('message', (channel, message) => {
				const notification = JSON.parse(message);
				console.log(notification);

				this.subscriber.unsubscribe();
				return resolve(notification);
			});
		});
	}

	@ResolveField()
	async posts(@Parent() user: User) {
		user = await this.userService.findOne(user.id, { relations: ['posts'] });

		return user.posts.sort((a, b) => a.createdAt < b.createdAt ? 1 : -1);
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
		user = await this.userService.findOne(user.id, { relations: ['following'] });
		return await this.userService.followUser(user, userId);
	}

	@Mutation(() => User)
	async unfollowUser(
		@RequestUser() user: User,
		@Args('userId') userId: number,
	): Promise<User> {
		user = await this.userService.findOne(user.id, { relations: ['following'] });
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
