import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
    @Prop()
    chatId: string;
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
