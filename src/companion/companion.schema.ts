import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';

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
    dialog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dialog',
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
});
export type CompanionDocument = HydratedDocument<Companion>;
@Schema()
export class Companion {
    @Prop()
    user: User;
    @Prop()
    dialog: string;
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
}

export const CompanionSchema = SchemaFactory.createForClass(Companion);
