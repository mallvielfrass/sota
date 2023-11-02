import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Dialog } from 'src/dialog/dialog.schema';

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

    dialogs: Dialog[];
}
export const UserSchema = SchemaFactory.createForClass(User);
// export const CatSchema = SchemaFactory.createForClass(Cat);
