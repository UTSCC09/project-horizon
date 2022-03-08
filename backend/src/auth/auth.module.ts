import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const passport = PassportModule.register({
  defaultStrategy: 'jwt',
  property: 'user',
  session: false,
});

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: 'FAE66439AA3F6EBDF6E16DD0EA9EFBAF6F8A4811754132A4F469D6ED2DD367F5',
      signOptions: {
        expiresIn: '10d',
      },
    }),
    passport,
  ],
  providers: [AuthService, JwtStrategy, AuthController],
  exports: [JwtModule, passport],
})
export class AuthModule { }
