import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.setGlobalPrefix('api');
  app.use(helmet());
  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Learning React Native API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
