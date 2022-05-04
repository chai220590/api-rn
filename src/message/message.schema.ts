import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { Document } from 'mongoose';
dotenv.config();

export type MessageDocument = Message & Document;
@Schema({
  collection: `${process.env.SYS_PREFIX}messages`,
})
export class Message {
  @Prop({
    type: String,
    required: true,
    ref: `${process.env.SYS_PREFIX}users`,
  })
  userId: string;
  @Prop({
    type: String,
    required: true,
  })
  message: string;
  @Prop({
    type: Date,
    default: Date.now(),
  })
  createDate: Date;
}

const MessageSchema = SchemaFactory.createForClass(Message);
export default MessageSchema;
