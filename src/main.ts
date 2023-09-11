import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe, Logger} from '@nestjs/common'
import helmet from 'helmet';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  app.use(helmet());
  app.enableCors();
  
  await app.listen(process.env.PORT).then(() => {
    logger.log('Server is running on port: ' + process.env.PORT)
  });
}
try {
bootstrap();
  
} catch (error) {
  throw new Error(error)
}
