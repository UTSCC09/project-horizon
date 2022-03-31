import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { Repository, FindOneOptions } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) { }

  async create(data: Comment): Promise<Comment> {
    const comment = new Comment();
    comment.text = data.text;
    comment.user = data.user;
    comment.post = data.post;
    console.log(data);
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
    });
  }

  findOne(id: string, options?: FindOneOptions<Comment>): Promise<Comment> {
    return this.commentRepository.findOne(id, options);
  }

}
