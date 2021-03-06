import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
import { PaginatedPost, Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { PostService } from './post.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FileService } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';

@Resolver(() => Post)
@UseGuards(GqlAuthGuard)
export class PostResolver {

  constructor(
    private readonly postService: PostService,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {
  }

  @Mutation(() => Post)
  async createPost(
    @Args('content') content: String,
    @RequestUser() user: User,
    @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true }) files?: FileUpload[],
  ): Promise<Post> {
    files = await Promise.all((await Promise.all(files)).map(file => this.fileService.upload(file, user)));
    return await this.postService.create(({ content, user, files } as Post));
  }

  @Query(() => PaginatedPost)
  async feed(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @RequestUser() user: User,
  ): Promise<PaginatedPost> {
    user = await this.userService.findOne(user.id, { relations: ['following'] });
    return this.postService.userFeed(user, page, limit);
  }

  @Query(() => PaginatedPost)
  async discover(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @RequestUser() user: User,
  ): Promise<PaginatedPost> {
    return this.postService.discover(user.id, page, limit);
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Query(() => Post)
  async getPost(@Args('id') id: number): Promise<Post> {
    return await this.postService.findOne(id);
  }

  @Query(() => PaginatedPost)
  async getUserPosts(
    @Args('page') page: number,
    @Args('limit') limit: number,
    @Args('userId') userId: number
  ): Promise<PaginatedPost> {
    return this.postService.getUserPosts(userId, page, limit);
  }

  @ResolveField()
  async files(@Parent() post: Post) {
    const { id } = post;
    return await this.fileService.postFiles(id);
  }

  @ResolveField()
  async user(@Parent() post: Post) {
    post = await this.postService.findOne(post.id, { relations: ['user'] });
    return post.user;
  }

  @ResolveField()
  async comments(@Parent() post: Post) {
    post = await this.postService.findOne(post.id, { relations: ['comments'] });

    return post.comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  @Mutation(() => Number)
  async deletePost(
    @Args('id') id: number,
    @RequestUser() user: User,
  ): Promise<number> {
    return await this.postService.remove(id, user);
  }

  @Mutation(() => Post)
  async likePost(
    @Args('postId') postId: number,
    @RequestUser() user: User,
  ) {
    return await this.postService.like(postId, user);
  }

  @Mutation(() => Post)
  async unlikePost(
    @Args('postId') postId: number,
    @RequestUser() user: User,
  ) {
    return await this.postService.unlike(postId, user);
  }

  @ResolveField()
  async liked(
    @Parent() post: Post,
    @RequestUser() user: User,
  ) {
    return await this.postService.isLiked(post.id, user);
  }
}
