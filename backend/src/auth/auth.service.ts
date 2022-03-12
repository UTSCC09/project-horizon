import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtPayload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInfo, User, UserInput } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  /** Create user with user data
   * @param  {User} userData
   * @returns Promise
   */
  async register(userData: UserInput): Promise<User> {
    return this.userService.create(userData);
  }

  /** Sign token for user
   * @param  {LoginInfoDto} userData
   * @returns Promise
   */
  async login(userData: LoginInfo): Promise<string> {
    const user = await this.getAuthenticatedUser(
      userData.email,
      userData.password,
    );
    const token = this._createToken(user);

    return token;
  }

  /** Ensure user is authenticated.
   * @param  {string} email
   * @param  {string} password
   */
  public async getAuthenticatedUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    await this.verifyPassword(password, user.password);
    delete user.password;
    return user;
  }

  /** Compare passwords
   * @param  {string} plainTextPassword
   * @param  {string} hashedPassword
   */
  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /** Validates user is valid with token
   * @param  {JwtPayload} payload
   * @returns Promise
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findByEmail(payload.email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  /** creates token for user
   * @param  {User} {email}
   * @returns any
   */
  private _createToken({ email }: User): string {
    const user = { email };
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }
}
