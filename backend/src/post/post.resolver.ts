import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, ResolveProperty, Resolver } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { PostService } from './post.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { FileService } from 'src/file/file.service';
import { UserService } from 'src/user/user.service';

type Files = File[];

@Resolver(() => Post)
@UseGuards(GqlAuthGuard)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly fileService: FileService,
  ) { }

  @Mutation(() => Post)
  async createPost(
    @Args('content') content: String,
    @RequestUser() user: User,
    @Args({ name: 'files', type: () => [GraphQLUpload], nullable: true }) files?: FileUpload[],
  ): Promise<Post> {
    console.log(files);
    files = await Promise.all((await Promise.all(files)).map(file => this.fileService.upload(file, user)));
    console.log(files);
    return await this.postService.create(({ content, user, files } as Post));
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Query(() => Post)
  async getPost(@Args('id') id: string): Promise<Post> {
    return await this.postService.findOne(id);
  }

  @Query(() => [Post])
  async getUserPosts(@Args('userId') userId: number): Promise<Post[]> {
    const posts = await this.postService.getUserPosts(userId);
    return posts;
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

  @Mutation(() => Number)
  async deletePost(@Args('id') id: string): Promise<number> {
    return await this.postService.remove(id);
  }
}
