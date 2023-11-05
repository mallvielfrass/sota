import {
    Controller,
    Get,
    HttpException,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserCoreService } from '../user/userCore.service';
import { DialogService } from './dialog.service';

@Controller('/api/dialog')
@UseGuards(AuthGuard)
export class DialogController {
    constructor(
        private readonly dialogService: DialogService,
        private readonly userCoreService: UserCoreService,
    ) {}
    //list of dialogs
    @Get('/')
    async listDialogs(@Req() req) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        // const dialogsResp: dialogResponse[] = [];
        const chats = await this.dialogService.getChatsList(userId, 0, 100);

        return {
            dialogs: chats,
        };
    }
    //get dialog by id
    @Get('/:id')
    async getDialogById(@Req() req, @Param('id') dialogId) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        const dialog = await this.dialogService.getDialogByIdForUser(
            dialogId,
            userId,
        );
        if (!dialog) {
            throw new HttpException('Not found', 404);
        }

        return { dialog: dialog };
    }
    @Post('/self')
    async createSelfChat(@Req() req) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        // console.log('internal payload', payload);
        // const finded = await this.dialogService.getPrivateChat(userId, companionId);
        // if (finded) {
        //   throw new HttpException('Already exist', 400);
        // }
        const res = await this.dialogService.getOrCreatePrivateDialog(
            userId,
            userId,
        );
        if (res.error) {
            throw new HttpException(res.error, 400);
        }
        //console.log('res', res);
        const dialog = res.dialog;
        //    console.log('userId', userId);
        const yourCompanions = dialog.companions.filter((companion) => {
            //    console.log('companion', companion);
            return companion.userId._id.toString() !== userId;
        });
        const yourCompanionId = yourCompanions.length
            ? yourCompanions[0].companionId.user._id.toString()
            : userId;
        const yourCompanion =
            await this.userCoreService.findUserById(yourCompanionId);
        return {
            dialog: {
                _id: dialog._id.toString(),
                chatType: dialog.chatType,
                owner: dialog.owner._id.toString(),
                companion: {
                    _id: yourCompanion._id.toString(),
                    email: yourCompanion.email,
                },
                //   companions: dialog.companions,
            },
        };
    }
    //createDialog
    @Post('/private/:companionId')
    async createDialog(@Req() req, @Param('companionId') companionId) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        // console.log('internal payload', payload);
        // const finded = await this.dialogService.getPrivateChat(userId, companionId);
        // if (finded) {
        //   throw new HttpException('Already exist', 400);
        // }
        const res = await this.dialogService.getOrCreatePrivateDialog(
            userId,
            companionId,
        );
        if (res.error) {
            throw new HttpException(res.error, 400);
        }
        //console.log('res', res);
        const dialog = res.dialog;
        //    console.log('userId', userId);
        const yourCompanions = dialog.companions.filter((companion) => {
            //    console.log('companion', companion);
            return companion.userId._id.toString() !== userId;
        });
        const yourCompanionId = yourCompanions.length
            ? yourCompanions[0].userId
            : userId;
        const yourCompanion =
            await this.userCoreService.findUserById(yourCompanionId);
        return {
            dialog: {
                _id: dialog._id.toString(),
                chatType: dialog.chatType,
                owner: dialog.owner._id.toString(),
                companion: {
                    _id: yourCompanion._id.toString(),
                    email: yourCompanion.email,
                },
                //   companions: dialog.companions,
            },
        };
    }
}
