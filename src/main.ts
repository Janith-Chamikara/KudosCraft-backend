import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
  } else {
    console.log('Running in development mode');
  }
}
bootstrap();
