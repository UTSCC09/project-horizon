import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedPost, Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { FindOneOptions, In, Not, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly userService: UserService,
  ) { }

  async create(data: Post): Promise<Post> {
    const post = new Post();
    post.content = data.content;
    post.user = data.user;
    post.files = data.files;

    return this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  findOne(id: number, options?: FindOneOptions<Post>): Promise<Post> {
    return this.postRepository.findOne(id, options);
  }

  findByIds(ids: number[]): Promise<Post[]> {
    return this.postRepository.findByIds(ids);
  }

  async discover(id: number, page: number, limit: number): Promise<PaginatedPost> {
    const [posts, total] = await this.postRepository.findAndCount(
      {
        where: {
          user: Not(id)
        },
        relations: ['files'],
        take: limit,
        skip: page * limit,
        order: {
          createdAt: 'DESC'
        }
      },
    );

    return {
      total,
      posts,
      page,
      limit,
    };
  }

  async userFeed(user: User, page: number, limit: number): Promise<PaginatedPost> {
    if (!user.following || !user.following.length) {
      return Promise.resolve({ total: 0, posts: [] });
    }

    // Get the most recent posts from the users were following
    const [posts, total] = await this.postRepository.findAndCount({
      where: {
        user: In(user.following.map(u => u.id))
      },
      relations: ['files'],
      take: limit,
      skip: page * limit,
    })

    return {
      total,
      posts,
      page,
      limit,
    }
  }

  async getUserPosts(userId: number, page: number = 0, limit: number = 10): Promise<PaginatedPost> {
    const posts = await this.postRepository.find({
      where: {
        user: userId
      },
      relations: ['files'],
      order: {
        createdAt: 'DESC'
      }
    });

    const total = await this.postRepository.count({
      where: {
        user: userId
      }
    });

    return {
      total,
      posts,
      page,
      limit,
    }
  }

  async update(id: number, post: Post): Promise<Post> {
    const postToUpdate = await this.postRepository.findOne(id);
    postToUpdate.content = post.content;

    return this.postRepository.save(postToUpdate);
  }

  async remove(id: number, user: User): Promise<number> {
    const postToRemove = await this.postRepository.findOne(id);
    if (postToRemove.user.id !== user.id) {
      throw new Error('You are not allowed to remove this post');
    }

    return await (await this.postRepository.delete(id)).affected;
  }
}