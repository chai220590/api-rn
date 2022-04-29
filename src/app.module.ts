import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './middleware/auth';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.SITE_CONNECTION_STRING),
    UserModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
