import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { IDialog } from '../dialog/dialog.schema';
import { IUser } from '../user/user.schema';

// message:{

//     ChatId > Dialog
// Type: user/service
// Text
// Media > []Media
// atCreated
// atEdited
// OriginalText
// Id
// CounterNumber
// }
export const messageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dialog',
    },
    type: {
        type: String,
        enum: ['user', 'service'],
    },
    text: String,
    media: [String],
    atCreated: Date,
    atEdited: Date,
    originalText: String,
    Id: String,
    counterNumber: Number,
});
export type IMessage = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dialog',
    })
    dialog: IDialog;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: IUser;
    @Prop()
    type: string;
    @Prop()
    text: string;
    @Prop()
    media: string[];
    @Prop()
    atCreated: Date;
    @Prop()
    atEdited: Date;
    @Prop()
    originalText: string;
    @Prop()
    Id: string;
    @Prop()
    counterNumber: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
