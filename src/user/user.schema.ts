import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export interface IUser extends mongoose.Document {
  email: string;
  username: string;
  isDeleted?: boolean;
  isBanned?: boolean;
  firstName?: string;
  lastName?: string;
  hash: string;
}
export const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  firstName: String,
  lastName: String,
  isDeleted: Boolean,
  isBanned: Boolean,
  hash: String,
});

export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  hash: string;
  @Prop()
  username: string;
  @Prop()
  firstName: string;
  @Prop()
  lastName: string;
  @Prop()
  isDeleted: boolean;
  @Prop()
  isBanned: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
// export const CatSchema = SchemaFactory.createForClass(Cat);
