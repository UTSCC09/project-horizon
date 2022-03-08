import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/entities/user.entity';
import { AuthService } from './auth.service';

export interface JwtPayload {
  email: string;
  iat: number;
  exp: number;
  sub: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'FAE66439AA3F6EBDF6E16DD0EA9EFBAF6F8A4811754132A4F469D6ED2DD367F5',
    });
  }

  /** validate token user
   * @param  {JwtPayload} payload
   * @returns Promise
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
