import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { IDialog } from '../dialog/dialog.schema';

export const userSchema = new mongoose.Schema({
    email: String,
    username: String,
    firstName: String,
    lastName: String,
    isDeleted: Boolean,
    isBanned: Boolean,
    hash: String,
});

export type IUser = HydratedDocument<User>;

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
    @Prop({
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dialog' }],
    })
    dialogs: IDialog[];
}
export const UserSchema = SchemaFactory.createForClass(User);
// export const CatSchema = SchemaFactory.createForClass(Cat);
