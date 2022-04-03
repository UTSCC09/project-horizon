import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from 'src/redis/redis.module';
import { UserModule } from 'src/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { BlacklistModule } from 'src/blacklist/blacklist.module';

const passport = PassportModule.register({
  defaultStrategy: 'jwt',
  property: 'user',
  session: false,
});

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.SECRETKEY,
        signOptions: { expiresIn: parseInt(process.env.EXPIRESIN) },
      }),
    }),
    passport,
    BlacklistModule,
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [JwtModule, passport],
})
export class AuthModule { }
