import { Injectable, HttpException, HttpStatus, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlacklistService } from 'src/blacklist/blacklist.service';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';

export interface JwtPayload {
  email: string;
  iat: number;
  exp: number;
  sub: string;
}

export const RequestUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req.user;
  },
);

export const AuthToken = createParamDecorator(
  (_: unknown, context: ExecutionContext): string => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    return req.headers.authorization?.replace('Bearer ', '');
  }
)

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly bl: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRETKEY,
      passReqToCallback: true
    });
  }

  /** validate token user
   * @param  {JwtPayload} payload
   * @returns Promise
   */
  async validate(req: any, payload: JwtPayload): Promise<User> {
    const token = req.headers?.authorization?.replace('Bearer ', '');

    if (await this.bl.blacklisted(token)) {
      throw new HttpException('Session Expired', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
