import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';
import { UserCoreService } from 'src/user/userCore.service';
import { CompanionService } from '../companion/companion.service';
import { DialogAdminService } from '../dialogAdmin/dialogAdmin.service';
import { userStatus } from '../dialogAdmin/dialogAdmin.types';
import { Dialog } from './dialog.schema';
import { DialogType, dialogResponse } from './dialog.types';

@Injectable()
export class DialogService {
    constructor(
        @InjectModel(Dialog.name) private readonly dialogModel: Model<Dialog>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly userCoreService: UserCoreService,
        private readonly companionService: CompanionService,
        private readonly dialogAdminService: DialogAdminService,
    ) {}
    async getDialogById(_id: string) {
        const dialog = await this.dialogModel.findById(_id);
        return dialog;
    }
    async getPrivateChat(userId: string, userTwoId: string) {
        //find chat where userId and companionId contains in companion array

        const and = [
            {
                companions: {
                    $elemMatch: {
                        userId: userId,
                    },
                },
            },
        ];
        if (userId !== userTwoId) {
            and.push({
                companions: {
                    $elemMatch: {
                        userId: userTwoId,
                    },
                },
            });
        }
        const searchRow = {
            //chatType: DialogType.private or DialogType.self
            $or: [
                { chatType: DialogType.private },
                { chatType: DialogType.self },
            ],

            $and: and,
        };
        //  console.log(' getPrivateChat>searchRow', searchRow);
        const dialog = await this.dialogModel.findOne(searchRow);

        //  console.log(' getPrivateChat>dialog', dialog);
        return dialog;
    }
    //createPrivateDialog
    async getOrCreatePrivateDialog(userId: string, userTwoId: string) {
        const user = await this.userCoreService.findUserById(userId);
        const userTwo = await this.userCoreService.findUserById(userTwoId);
        if (!user || !userTwo) {
            return { error: 'user not found' };
        }
        // console.log('users:', user, userTwo);
        const findedDialog = await this.getPrivateChat(userId, userTwoId);
        if (findedDialog) {
            return { dialog: findedDialog };
        }
        const query = {
            chatType: DialogType.private,
            owner: user,
        };
        if (userId === userTwoId) {
            query.chatType = DialogType.self;
        }
        const dialog = await this.dialogModel.create(query);
        let dialogName = `chat#${dialog._id.toString()}`;
        if (userId === userTwoId) {
            dialogName = 'savedMessages';
        }
        dialog.name = dialogName;
        // console.log('debug');
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
        //  console.log({ companionId: firstCompanion, userId: user });
        dialog.companions.push(
            { companionId: firstCompanion, userId: user },
            // { companionId: secondCompanion, userId: userTwo },
        );
        //   console.log('companions', dialog.companions);
        await dialog.save();

        user.dialogs.push({
            readedMessage: 0,
            dialog: dialog,
        });

        await user.save();
        if (userTwo._id.toString() !== user._id.toString()) {
            dialog.companions.push(
                //  { companionId: firstCompanion, userId: user },
                { companionId: secondCompanion, userId: userTwo },
            );

            userTwo.dialogs.push({
                readedMessage: 0,
                dialog: dialog,
            });
            await userTwo.save();
            await dialog.save();
        }

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
        owner.dialogs.push({
            readedMessage: 0,
            dialog: dialog,
        });

        await owner.save();
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
        await dialog.save();

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
    async getChatsList(userId: string, offset: number, limit: number) {
        const user = await this.userCoreService.findUserById(userId);
        if (!user) {
            return { error: 'user not found' };
        }

        const res = await this.userModel.aggregate([
            //find  user by id
            { $match: { _id: user._id } },
            //paginate dialogs
            {
                $project: {
                    dialogs: {
                        $slice: ['$dialogs', offset, limit],
                    },
                },
            },
            //join dialogs info as array dialogsList
            {
                $lookup: {
                    from: 'dialogs',
                    localField: 'dialogs.dialog',
                    foreignField: '_id',
                    as: 'dialogsList',
                },
            },
            //merge field readedMessage  and dialog to dialogsList <{readedMessage: {readedMessage: number}, dialog: IDialog} >
            {
                $addFields: {
                    dialogsList: {
                        $map: {
                            input: '$dialogsList',
                            as: 'dialog',
                            in: {
                                readedMessage: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$dialogs',
                                                as: 'dialogItem',
                                                cond: {
                                                    $eq: [
                                                        '$$dialogItem.dialog',
                                                        '$$dialog._id',
                                                    ],
                                                },
                                            },
                                        },
                                        0,
                                    ],
                                },
                                dialog: '$$dialog',
                            },
                        },
                    },
                },
            },
            //hide unwanted fields
            {
                $project: {
                    dialogsList: 1,
                },
            },
        ]);

        const dialogsListRaw = res.length == 1 ? res[0].dialogsList : [];
        if (dialogsListRaw.length === 0) {
            return [];
        }
        if (!Array.isArray(dialogsListRaw)) {
            return [];
        }
        const getNotUsersFromOneChat = (dialog) => {
            const privateChatsUsers = [];
            if (dialog?.dialog?.chatType == DialogType.private) {
                const companions = dialog?.dialog?.companions;
                if (!companions || !Array.isArray(companions)) {
                    return [];
                }
                const notUser = companions.filter(
                    (companion: { companionId: string; userId: string }) => {
                        return companion.userId !== userId;
                    },
                );
                if (notUser.length !== 1) {
                    return [];
                }
                privateChatsUsers.push(notUser[0].userId);
            }
            return privateChatsUsers;
        };
        const getNotUsersInAllChats = () => {
            const privateChatsUsers = [];
            dialogsListRaw.forEach((dialog) => {
                privateChatsUsers.push(getNotUsersFromOneChat(dialog));
            });
            return privateChatsUsers;
        };
        const privateChatsUsers = getNotUsersInAllChats();
        const userNamesMap = new Map<string, string>();
        const users =
            await this.userCoreService.findUsersByIds(privateChatsUsers);
        for (const user of users) {
            userNamesMap.set(
                user._id.toString(),
                `${user.firstName} ${user.lastName}`,
            );
        }

        const dialogsList: dialogResponse[] = dialogsListRaw.map((dialog) => {
            let dialogName =
                dialog?.dialog?.name || 'Chat#' + dialog?.dialog?._id;

            if (dialog?.dialog?.chatType == DialogType.private) {
                const usersFromChat = getNotUsersFromOneChat(dialog);
                if (1 <= usersFromChat.length) {
                    const name = userNamesMap.get(usersFromChat[0].toString());
                    if (name && name != ' ') {
                        dialogName = name;
                    }
                }
            }
            return {
                _id: dialog?.dialog?._id || '',
                chatType: dialog?.dialog?.chatType || '',
                name: dialogName || '',
                msgCount: dialog?.dialog?.msgCount || 0,
                readedMessage: dialog?.readedMessage?.readedMessage || 0,
            };
        });
        return dialogsList;
    }
}
