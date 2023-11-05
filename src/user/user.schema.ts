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
    @Prop({ default: false })
    isDeleted: boolean;
    @Prop({ default: false })
    isBanned: boolean;
    @Prop({
        default: [],
        type: [
            {
                readedMessage: {
                    type: Number,
                    default: 0,
                },
                dialog: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Dialog',
                },
            },
        ],
    })
    dialogs: {
        readedMessage: number;
        dialog: IDialog;
    }[];
    @Prop({ default: Date.now })
    createdAt: Date;
    @Prop({ default: Date.now })
    updatedAt: Date;
    @Prop({ default: 'default.png' })
    avatar: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
// export const CatSchema = SchemaFactory.createForClass(Cat);
