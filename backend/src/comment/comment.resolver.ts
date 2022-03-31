import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { RequestUser } from 'src/auth/jwt.strategy';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CommentService } from './comment.service';

@Resolver(() => Comment)
@UseGuards(GqlAuthGuard)
export class CommentResolver {
  constructor(
    private commentService: CommentService,
  ) {}

  @Mutation(() => Comment)
  async createComment(
    @Args('text') text: string,
    @Args('postId') postId: number,
    @RequestUser() user: User,
  ): Promise<Comment> {
    return await this.commentService.create({ text, user, post: ({ id: postId } as Post)} as Comment);
  }

  @Mutation(() => Comment)
  async likeComment(
    @Args('commentId') commentId: number,
    @RequestUser() user: User,
  ) {
    return await this.commentService.like(commentId, user);
  }

  @Mutation(() => Comment)
  async unlikeComment(
    @Args('commentId') commentId: number,
    @RequestUser() user: User,
  ) {
    return await this.commentService.unlike(commentId, user);
  }

  @ResolveField()
  async user(@Parent() comment: Comment) {
    comment = await this.commentService.findOne(comment.id, { relations: ['user'] });
    return comment.user;
  }

  @ResolveField()
  async likesCount(@Parent() comment: Comment) {
    return await this.commentService.findOne(comment.id, { relations: ['likes'] }).then(comment => comment.likes.length);
  }
}
