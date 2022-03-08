import {
  Controller,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Args, Mutation } from '@nestjs/graphql';
import { LoginInfo, User, UserInput, UserToken } from 'src/entities/user.entity';


@Injectable()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => User)
  async register(@Args('data') userData: UserInput): Promise<User> {
    return await this.authService.register(userData);
  }


  @Mutation(() => UserToken)
  async login(@Args('data') userData: LoginInfo): Promise<UserToken> {
    const token = await this.authService.login(userData);
    const user = await this.authService.getAuthenticatedUser(userData.email, userData.password);
    return { token, ...user };
  }
}
