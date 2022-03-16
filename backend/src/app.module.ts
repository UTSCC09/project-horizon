import { Module } from '@nestjs/common';
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

const isProd = process.env.NODE_ENV === 'production' ||  process.env.GAE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: isProd ? "/tmp/schema.gql" : "schema.gql",
      playground: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ...(isProd ? {
        extra: {
          socketPath: process.env.DB_HOST,
        }
      } : {}),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    PostModule,
    FileModule
  ],
  providers: [AppController],
})
export class AppModule {
  constructor(private readonly connection: Connection) { }
}