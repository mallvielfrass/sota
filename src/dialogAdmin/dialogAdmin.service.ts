import { InjectModel } from '@nestjs/mongoose';
import { DialogAdmin } from './dialogAdmin.scheme';
import { Model } from 'mongoose';
import { userStatus } from './dialogAdmin.types';

export class DialogAdminService {
  constructor(
    @InjectModel(DialogAdmin.name)
    private readonly dialogAdminModel: Model<DialogAdmin>,
  ) {}
  async getAdminByDialogIdAndUserId(dialogId: string, userId: string) {
    const dialogAdmin = await this.dialogAdminModel.findOne({
      dialogId: dialogId,
      userId: userId,
    });
    return dialogAdmin;
  }
  async getAdminById(_id: string) {
    const dialogAdmin = await this.dialogAdminModel.findById(_id);
    return dialogAdmin;
  }
  async createAdmin(dialogId: string, userId: string, status: userStatus) {
    const dialogAdmin = await this.dialogAdminModel.create({
      dialogId: dialogId,
      userId: userId,
      status: status,
      privillegies: {
        deleteMessage: false,
        BanUser: false,
        allowSetPrivillegies: false,
      },
    });
    return dialogAdmin;
  }
}
