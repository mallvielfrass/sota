import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { ICompanion } from '../companion/companion.schema';
import { IDialogAdmin } from '../dialogAdmin/dialogAdmin.scheme';
import { IMessage } from '../message/message.schema';
import { IUser } from '../user/user.schema';

export type IDialog = HydratedDocument<Dialog>;
@Schema()
export class Dialog {
    @Prop({
        default: [],
        type: [
            {
                companionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Companion',
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            },
        ],
    })
    companions: {
        companionId: ICompanion;
        userId: IUser;
    }[];
    @Prop()
    name: string;
    @Prop()
    chatType: string;
    @Prop({
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    })
    messages: IMessage[];
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    owner: IUser;
    @Prop({
        default: [],
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DialogAdmin' }],
    })
    admins: IDialogAdmin[];

    @Prop({
        default: 0,
        type: Number,
    })
    msgCount: number;
}

export const DialogSchema = SchemaFactory.createForClass(Dialog);
