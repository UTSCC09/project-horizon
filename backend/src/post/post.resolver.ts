import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { PostService } from './post.service';

@Injectable()
@UseGuards(GqlAuthGuard)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
  ) { }

  @Mutation(() => Post)
  async createPost(
    @Args('content') content: String,
    @RequestUser() user: User,
  ): Promise<Post> {
    return await this.postService.create(({ content, user } as Post));
  }

  @Query(() => [Post])
  async getPosts(): Promise<Post[]> {
    return await this.postService.findAll();
  }

  @Query(() => Post)
  async getPost(@Args('id') id: string): Promise<Post> {
    return await this.postService.findOne(id);
  }

  @Mutation(() => Number)
  async deletePost(@Args('id') id: string): Promise<number> {
    return await this.postService.remove(id);
  }
}
