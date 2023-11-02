import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserCoreService } from 'src/user/userCore.service';
import { CompanionService } from '../companion/companion.service';
import { DialogAdminService } from '../dialogAdmin/dialogAdmin.service';
import { userStatus } from '../dialogAdmin/dialogAdmin.types';
import { Dialog } from './dialog.schema';
import { DialogType } from './dialog.types';

@Injectable()
export class DialogService {
    constructor(
        @InjectModel('Dialog') private readonly dialogModel: Model<Dialog>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly userCoreService: UserCoreService,
        private readonly companionService: CompanionService,
        private readonly dialogAdminService: DialogAdminService,
    ) {}
    async getPrivateChat(userId: string, userTwoId: string) {
        //find chat where userId and companionId contains in companion array
        const dialog = await this.dialogModel.findOne({
            chatType: DialogType.private,
            $and: [
                { 'companion.userId': userId },
                { 'companion.userId': userTwoId },
            ],
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
            owner: user,
            admins: [user, userTwo],
            messages: [],
            companions: [],
        });
        const firstCompanion = await this.companionService.getOrCreateCompanion(
            dialog,
            user,
        );
        if (!firstCompanion) {
            return { error: 'companion not found' };
        }
        const secondCompanion =
            await this.companionService.getOrCreateCompanion(dialog, userTwo);
        if (!secondCompanion) {
            return { error: 'companion not found' };
        }
        dialog.companions.push(
            { companionId: firstCompanion, userId: user },
            { companionId: secondCompanion, userId: userTwo },
        );

        await dialog.save();
        user.dialogs.push(dialog);
        await user.save();
        userTwo.dialogs.push(dialog);
        await userTwo.save();
        return { dialog };
    }
    async createPublicDialog(ownerId: string, users: string[]) {
        const owner = await this.userCoreService.findUserById(ownerId);
        if (!owner) {
            return { error: 'owner not found' };
        }
        const findedUsers = await this.userCoreService.findUsersByIds(users);
        if (!findedUsers) {
            return { error: 'users not found' };
        }

        const dialog = await this.dialogModel.create({
            chatType: DialogType.public,
            owner: owner,
            admins: [],
            messages: [],
            companions: [],
        });
        const admin = await this.dialogAdminService.createAdmin(
            dialog._id.toString(),
            ownerId,
            userStatus.owner,
        );
        if (!admin) {
            return { error: 'admin not found' };
        }
        await this.dialogAdminService.changeAdminPermissions(
            dialog._id.toString(),
            ownerId,
            { deleteMessage: true, BanUser: true, allowSetPrivillegies: true },
        );
        dialog.admins.push(admin);
        const companions = await this.companionService.createCompanions(
            dialog._id.toString(),
            findedUsers,
        );
        if (!companions) {
            return { error: 'companions not found' };
        }
        dialog.companions = companions.map((c) => ({
            companionId: c,
            userId: c.user,
        }));
        await dialog.save();
        return { dialog };
    }
}
