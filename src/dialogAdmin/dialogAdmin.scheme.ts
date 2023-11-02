import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

@Schema()
export class DialogAdmin {
    @Prop()
    dialogId: Dialog;
    @Prop()
    userId: User;
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
