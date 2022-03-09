import { Injectable, UseGuards } from '@nestjs/common';
import { Query } from '@nestjs/graphql';
import { RequestUser } from './auth/jwt.strategy';
import { User } from './entities/user.entity';
import { GqlAuthGuard } from './guards/gql-auth.guard';

@Injectable()
export class AppController {

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  hello(
    @RequestUser() user: User,
  ): string {
    return 'Hello World!' + user?.firstName;
  }
}
