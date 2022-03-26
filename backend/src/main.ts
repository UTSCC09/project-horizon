import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from "graphql-upload";
import fs from 'fs';

const httpsOptions = {
  key: fs.readFileSync('./secrets/private-key.pem'),
  cert: fs.readFileSync('./secrets/public-certificate.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.use(graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
