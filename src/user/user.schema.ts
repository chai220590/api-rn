import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { Document } from 'mongoose';

dotenv.config();
export type UserDocument = User & Document;

@Schema({
  collection: `${process.env.SYS_PREFIX}users`,
})
export class User {
  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  username: string;

  @Prop({
    required: true,
    type: String,
  })
  password: string;

  @Prop({
    default: 'ACTIVE',
    type: String,
    enum: ['ACTIVE', 'DELETE'],
  })
  status: string;

  @Prop({
    default: 'USER',
    type: String,
    enum: ['ADMIN', 'USER'],
  })
  role: string;

  @Prop({
    default: Date.now(),
    type: Date,
  })
  createDate: Date;

  @Prop({
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaK4zfz4SxPaBo6CIwLLxUZ5tby1Q_1uuuug&usqp=CAU',
    type: String,
  })
  avatar: string;
}

const UserSchema = SchemaFactory.createForClass(User);
export default UserSchema;
