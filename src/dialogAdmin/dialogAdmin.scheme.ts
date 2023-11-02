import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { Dialog } from '../dialog/dialog.schema';
//import { HydratedDocument } from 'mongoose';
import { User } from 'src/user/user.schema';
import { userStatus } from './dialogAdmin.types';

// export interface IDialogAdmin extends mongoose.Document {
//   dialogId: Dialog;
//   userId: User;
//   status: userStatus;
//   privillegies: {
//     deleteMessage: boolean;
//     BanUser: boolean;
//     allowSetPrivillegies: boolean;
//   };
// }
export type IDialogAdmin = HydratedDocument<DialogAdmin>;
@Schema()
export class DialogAdmin {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Dialog' })
    dialog: Dialog;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
    @Prop({ enum: userStatus })
    status: userStatus;
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
export const DialogAdminSchema = SchemaFactory.createForClass(DialogAdmin);
