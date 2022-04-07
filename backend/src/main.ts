import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload';
import { SentryService } from '@ntegral/nestjs-sentry';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 200000000, maxFiles: 10 }));
  app.useLogger(SentryService.SentryServiceInstance());


  if (process.env.NODE_ENV === 'production') {
    // this way the health endpoint is not exposed externally
    app.setGlobalPrefix('api', { exclude: ['health'] });
  } else {
    // enable CORS for local development
    app.enableCors();
  }

  await app.listen(3000);
}

bootstrap();
