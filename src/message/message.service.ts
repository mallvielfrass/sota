import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DialogService } from '../dialog/dialog.service';
import { MessageCounterService } from '../message-counter/message-counter.service';
import { MessageDto } from './message.dto';
import { Message } from './message.schema';
import { MessageResponse, MessageType } from './message.types';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>,
        private readonly dialogService: DialogService,
        private readonly messageCounterService: MessageCounterService,
    ) {}

    async getMessagesByDialogId(
        dialogId: string,
        userId: string,
        constraints: { limit: number; offset: number; reverse: boolean },
    ) {
        const reverse = constraints.reverse ? -1 : 1;
        const dialog = await this.dialogService.getDialogById(dialogId);
        if (!dialog) {
            return { error: 'dialog not found' };
        }
        const findedMessages = await this.messageModel
            .find({
                dialog: dialog._id,
                //and isDeletedFor not include userId or "all"
                isDeletedFor: {
                    $ne: [userId, 'all'],
                },
            })
            .populate('user')
            .sort({ atCreated: reverse })
            .skip(constraints.offset)
            .limit(constraints.limit)
            .exec();

        const messages: MessageResponse[] = [];
        for (const message of findedMessages) {
            messages.push({
                dialogId: message.dialog._id.toString(),
                userId: message.user._id.toString(),
                type: message.type,
                text: message.text,
                media: message.media,
                atCreated: message.atCreated,
                atEdited: message.atEdited,
                originalText: message.originalText,
                userFullName:
                    message.user.firstName + ' ' + message.user.lastName,
                //    Id: message.Id,
                cId: message.cId,
                isMyMessage: message.user._id.toString() === userId,
            });
        }
        return messages;
    }
    async createMessage(dialogId: string, userId: string, body: MessageDto) {
        const dialog = await this.dialogService.getDialogById(dialogId);
        if (!dialog) {
            return { error: 'dialog not found' };
        }
        const msgId =
            await this.messageCounterService.getNewMessageCount(dialogId);

        const message = await this.messageModel.create({
            dialog: dialog._id,
            user: userId,
            type: MessageType.user,
            text: body.text,
            media: [],
            atCreated: new Date(),
            atEdited: new Date(),
            originalText: body.text,
            cId: msgId,
            isDeletedFor: [],
        });
        return { message };
    }
    async checkUserInDialog(dialogId: string, userId: string) {
        return await this.dialogService.checkUserInDialog(dialogId, userId);
    }
}
