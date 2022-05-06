import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
function disableUpgradeInsecureRequests(app: any, helmet: any) {
  const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
  delete defaultDirectives['upgrade-insecure-requests'];

  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...defaultDirectives,
      },
    }),
  );
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Learning React Native API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(helmet());
  disableUpgradeInsecureRequests(app, helmet);
  await app.listen(process.env.PORT || 22220);
}
bootstrap();
