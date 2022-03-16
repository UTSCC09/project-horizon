import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
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

  findOne(id: string, options?: FindOneOptions<Post>): Promise<Post> {
    return this.postRepository.findOne(id, options);
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return this.postRepository.find({
      where: {
        user: userId
      },
      relations: ['files']
    });
  }

  async update(id: string, post: Post): Promise<Post> {
    const postToUpdate = await this.postRepository.findOne(id);
    postToUpdate.content = post.content;

    return this.postRepository.save(postToUpdate);
  }

  async remove(id: string): Promise<number> {
    return await (await this.postRepository.delete(id)).affected;
  }
}