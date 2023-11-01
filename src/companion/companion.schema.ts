import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
//companion:{
// User > User
// status: user/admin/owner
// permission: {read,write}
// privillegies: {
// deleteMessage
// BanUser
// allowSetPrivillegies}
// Id
// DialogId > Dialog
// LastReadMessage: CounterNumber
// isLeaved

//}

export const companionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: ['user', 'admin', 'owner'],
  },
  permission: {
    read: {
      type: Boolean,
      default: false,
    },
    write: {
      type: Boolean,
      default: false,
    },
  },
  privillegies: {
    deleteMessage: {
      type: Boolean,
      default: false,
    },
    BanUser: {
      type: Boolean,
      default: false,
    },
    allowSetPrivillegies: {
      type: Boolean,
      default: false,
    },
  },
});
export type CompanionDocument = HydratedDocument<Companion>;
@Schema()
export class Companion {
  @Prop()
  user: User;
  @Prop()
  status: string;
  @Prop({
    type: () => ({
      read: Boolean,
      write: Boolean,
    }),
  })
  permission: {
    read: boolean;
    write: boolean;
  };
  @Prop({
    type: () => ({
      deleteMessage: Boolean,
      BanUser: Boolean,
      allowSetPrivillegies: Boolean,
    }),
  })
  privillegies: {
    deleteMessage: boolean;
    BanUser: boolean;
    allowSetPrivillegies: boolean;
  };
}

export const CompanionSchema = SchemaFactory.createForClass(Companion);
