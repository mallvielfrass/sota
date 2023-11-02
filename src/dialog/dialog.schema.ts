import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Companion } from 'src/companion/companion.schema';
import { Message } from 'src/messages/message.schema';
import { DialogAdmin } from '../dialogAdmin/dialogAdmin.scheme';
import { User } from './../user/user.schema';

export type DialogDocument = HydratedDocument<Dialog>;
@Schema()
export class Dialog {
    @Prop({
        type: () => [
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
        companionId: Companion;
        userId: User;
    }[];

    @Prop()
    chatType: string;
    @Prop()
    messages: Message[];
    @Prop()
    owner: User;
    @Prop()
    admins: DialogAdmin[];
}

export const DialogSchema = SchemaFactory.createForClass(Dialog);
