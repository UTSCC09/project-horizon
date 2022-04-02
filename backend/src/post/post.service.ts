import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { FindOneOptions, Repository } from 'typeorm';

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

  async userFeed(user: User, page: number, limit: number): Promise<number[]> {
    if (!user.following || !user.following.length) {
      return Promise.resolve([]);
    }

    // Get the most recent posts from the users were following
    const str = `
      SELECT p.id
      FROM post p
      where p."userId" in (
        ${user.following.map(u => `${u.id}`).join(',')}
      )
      ORDER BY p."created_at" DESC
      LIMIT ${limit}
      OFFSET ${page * limit}
    `;

    return this.postRepository.query(str)
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        user: userId
      },
      relations: ['files'],
      order: {
        createdAt: 'DESC'
      }
    });
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