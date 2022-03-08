import {
  Controller,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Args, Mutation } from '@nestjs/graphql';
import { LoginInfo, User, UserInput } from 'src/entities/user.entity';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Mutation(returns => User)
  async register(@Args('userInput') userData: UserInput): Promise<User> {

    try {
      return await this.authService.register(userData);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }


  @Mutation(returns => String)
  async login(@Args('loginInfo') userData: LoginInfo): Promise<String> {
    return this.authService.login(userData);
  }
}
