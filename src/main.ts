import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from '@nestjs/common'
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet());
  app.enableCors();
  await app.listen(process.env.PORT);
}
try {
bootstrap();
  
} catch (error) {
  throw new Error(error)
}
