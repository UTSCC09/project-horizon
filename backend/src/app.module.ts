import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Connection } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FileModule } from './file/file.module';
import { HealthController } from './health/health.controller';
import { CommentModule } from './comment/comment.module';

import { RedisModule } from './redis/redis.module';
import { SentryModule } from '@ntegral/nestjs-sentry';

import { APP_INTERCEPTOR } from '@nestjs/core';
import { GraphqlInterceptor } from '@ntegral/nestjs-sentry';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isProd ? "/tmp/schema.gql" : "schema.gql",
      path: isProd ? "/api/graphql" : "/graphql",
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: false,
      environment: isProd ? 'production' : 'dev',
      release: null,
      logLevels: ['error', 'warn'],
    }),
    AuthModule,
    PostModule,
    FileModule,
    UserModule,
    CommentModule,
    RedisModule,
  ],
  providers: [
    AppController,
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
  controllers: [HealthController],
})
export class AppModule {}