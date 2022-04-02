import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User } from 'src/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import { Repository, FindOneOptions } from 'typeorm';

@Injectable()
export class CommentService {
  private redisClient;

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getClient();
  }

  async create(data: Comment): Promise<Comment> {
    const comment = new Comment();
    comment.text = data.text;
    comment.user = data.user;
    comment.post = data.post;
    return this.commentRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
    });
  }

  async findOne(id: number, options?: FindOneOptions<Comment>): Promise<Comment> {
    return this.commentRepository.findOne(id, options);
  }

  async unlike(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne(commentId, { relations: ['likes'] });
    comment.likes = comment.likes.filter(like => like.id !== user.id);
    return this.commentRepository.save(comment);
  }

  async like(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne(commentId, { relations: ['likes'] });
    if (comment.likes) {
      comment.likes.push(user);
    } else {
      comment.likes = [user];
    }

    return this.commentRepository.save(comment);
  }

  async isLiked(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne(commentId, { relations: ['likes'] });
    return comment.likes.some(like => like.id === user.id);
  }
}
