import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserDocument, UserSchema } from './../user/user.schema';
import { Companion, CompanionDocument } from 'src/companion/companion.schema';
import { Message, MessageDocument } from 'src/messages/message.schema';
// companions > []Companion
// chatType: private/public/closed
// Messages >  []Message
// Owner > User
// Admins> []Companion
// Id
export interface IDialog extends mongoose.Document {
  companion: Companion[];
  chatType: string;
  messages: Message[];
  owner: User;
  admins: Companion[];
  privateUsers: User[];
}
export const dialogSchema = new mongoose.Schema({
  companion: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Companion',
    },
  ],
  chatType: String,
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Companion',
    },
  ],
  privateUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});
export type DialogDocument = HydratedDocument<IDialog>;
@Schema()
export class Dialog {
  @Prop()
  companion: Companion[];
  @Prop()
  chatType: string;
  @Prop()
  messages: Message[];
  @Prop()
  owner: User;
  @Prop()
  admins: Companion[];
  @Prop()
  privateUsers: User[];
}

export const DialogSchema = SchemaFactory.createForClass(Dialog);
