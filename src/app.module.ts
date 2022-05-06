import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.SITE_CONNECTION_STRING),
    UserModule,
    MessageModule,
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
