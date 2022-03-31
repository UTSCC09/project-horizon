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

  @ResolveField()
  async user(@Parent() comment: Comment) {
    comment = await this.commentService.findOne(comment.id, { relations: ['user'] });
    return comment.user;
  }

}
