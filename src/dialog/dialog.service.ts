import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DialogType } from './dialog.types';
import { User } from 'src/user/user.schema';
import { Model } from 'mongoose';
import { Dialog } from './dialog.schema';
import { UserCoreService } from 'src/user/userCore.service';

@Injectable()
export class DialogService {
  constructor(
    @InjectModel('Dialog') private readonly dialogModel: Model<Dialog>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly userCoreService: UserCoreService,
  ) {}
  async getPrivateChat(userId: string, userTwoId: string) {
    //find chat where userId and companionId contains in companion array
    const dialog = await this.dialogModel.findOne({
      chatType: DialogType.private,
      privateUsers: { $all: [userId, userTwoId] },
    });
    return dialog;
  }
  //createPrivateDialog
  async createPrivateDialog(userId: string, userTwoId: string) {
    const user = await this.userCoreService.findUserById(userId);
    const userTwo = await this.userCoreService.findUserById(userTwoId);
    if (!user || !userTwo) {
      return { error: 'user not found' };
    }
    const dialog = await this.dialogModel.create({
      chatType: DialogType.private,
      privateUsers: [userId, userTwoId],
    });

    user.dialogs.push(dialog);
    await user.save();
    userTwo.dialogs.push(dialog);
    await userTwo.save();
    return { dialog };
  }
}
