import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

@Injectable()
export class AppController {

  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
