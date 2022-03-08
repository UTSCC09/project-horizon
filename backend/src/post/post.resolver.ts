import { Injectable } from '@nestjs/common';
import { Args, Mutation, Query} from '@nestjs/graphql';
import { Post } from 'src/entities/post.entity';
import { PostService } from './post.service';

@Injectable()
export class PostResolver {
  constructor(
    private readonly postService: PostService,
  ) {}

  @Mutation(() => Post)
  async createPost(@Args('content') content: String): Promise<Post> {
    return await this.postService.create(({content} as Post));
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
