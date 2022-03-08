import { Injectable } from '@nestjs/common';
import { Query } from '@nestjs/graphql';

@Injectable()
export class AppService {

  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
