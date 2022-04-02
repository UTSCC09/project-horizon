import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/entities/comment.entity';
import { User, NotificationType } from 'src/entities/user.entity';
import { PostService } from 'src/post/post.service';
import { RedisService } from 'src/redis/redis.service';
import { Repository, FindOneOptions } from 'typeorm';

@Injectable()
export class CommentService {
  private publisher;

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly redisService: RedisService,
    private readonly postService: PostService,
  ) {
    this.publisher = this.redisService.publisher;
  }

  async notify(comment: Comment) {
    const post = await this.postService.findOne(comment.post.id, { relations: ['user'] })

    this.publisher.publish(`notifications:${post.user.id}`,
      JSON.stringify({
        type: NotificationType.COMMENT,
        sourceId: comment.id,
        payload: JSON.stringify({
          id: comment.id,
          comment: comment.text,
          post: {
            id: post.id,
            content: post.content,
          },
          user: {
            id: comment.user.id,
            firstName: comment.user.firstName,
            lastName: comment.user.lastName,
            email: comment.user.email,
          }
        }),
        createdAt: comment.createdAt
      })
    );
  }

  async create(data: Comment): Promise<Comment> {
    const comment = new Comment();
    comment.text = data.text;
    comment.user = data.user;
    comment.post = data.post;

    const newComment = await this.commentRepository.save(comment);
    const postOwner = await this.postService.findOne(newComment.post.id, { relations: ['user'] });

    if (data.user.id != postOwner.user.id)
      this.notify(newComment);

    return newComment;
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
    const comment = await this.commentRepository.findOne(commentId, { relations: ['likes', 'user'] });
    if (user.id != comment.user.id)
      this.publishLike(comment, user);
    else
      throw new HttpException(
        'You cannot like your own comment',
        HttpStatus.BAD_REQUEST
      );

    if (comment.likes) {
      comment.likes.push(user);
    } else {
      comment.likes = [user];
    }

    return this.commentRepository.save(comment);
  }

  async publishLike(comment: Comment, sourceUser: User) {
    this.publisher.publish(`notifications:${comment.user.id}`,
      JSON.stringify({
        type: NotificationType.LIKE,
        sourceId: sourceUser.id,
        payload: JSON.stringify({
          comment: {
            id: comment.id,
            text: comment.text,
          },
          user: {
            id: sourceUser.id,
            firstName: sourceUser.firstName,
            lastName: sourceUser.lastName,
            email: sourceUser.email,
          }
        }),
        createdAt: comment.createdAt
      })
    );
  }

  async isLiked(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne(commentId, { relations: ['likes'] });
    return comment.likes.some(like => like.id === user.id);
  }
}
