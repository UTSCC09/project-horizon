import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from "graphql-upload";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));

  if (process.env.NODE_ENV === 'production' ||  process.env.GAE_ENV === 'production') {
    // this way the health endpoint is not exposed externally
    app.setGlobalPrefix('api', { exclude: ['health'] });
  }

  await app.listen(3000);
}
bootstrap();
