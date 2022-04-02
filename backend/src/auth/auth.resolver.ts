import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Args, Mutation } from '@nestjs/graphql';
import { LoginInfo, ResultStatus, User, UserInput, UserToken } from 'src/entities/user.entity';
import { AuthToken } from './jwt.strategy';

@Injectable()
export class AuthResolver {
  constructor(private readonly authService: AuthService) { }

  @Mutation(() => UserToken)
  async register(@Args('data') userData: UserInput): Promise<UserToken> {
    // Confirm password matches
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const user = await this.authService.register(userData);
    const token = this.authService.createUserToken(user);
    return { token, user };
  }

  @Mutation(() => UserToken)
  async login(
    @Args('data') userData: LoginInfo,
  ): Promise<UserToken> {
    const token = await this.authService.login(userData);
    const user = await this.authService.getAuthenticatedUser(userData.email, userData.password);
    return { token, user };
  }

  @Mutation(() => ResultStatus)
  logout(
    @AuthToken() token: any,
  ): ResultStatus {
    this.authService.invalidateUser(token);
    return { message: 'logged out', status: true }
  }
}
