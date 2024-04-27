import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Forex Trading System')
    .setDescription('All the APIs related to Forex Trading System')
    .setVersion('1.0')
    .addTag('Accounts')
    .addTag('FX-Rates')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
