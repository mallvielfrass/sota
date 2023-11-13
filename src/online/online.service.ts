import * as PicoDB from 'picodb';

import { Injectable } from '@nestjs/common';
export enum onlinerType {
    user = 'user',
    bot = 'bot',
}
interface IOnline {
    onlinerType: onlinerType;
    userId: string;
    dialogs: string[];
    sendMessage: (message: string) => Promise<void>;
}
@Injectable()
export class OnlineService {
    //   private readonly onliners: Map<string, IOnline> = new Map();
    private readonly db = PicoDB();
    async createOnlineUser(onliner: IOnline) {
        this.db.insertOne({
            onlinerType: onliner.onlinerType,
            userId: onliner.userId,
            dialogs: onliner.dialogs,
            sendMessage: onliner.sendMessage,
        });
    }
    async getOnlineUser(userId: string) {
        return await this.db.findOne({ userId: userId });
    }
    async deleteOnlineUser(userId: string) {
        this.db.deleteOne({ userId: userId });
    }
    async sendMessage(userId: string, message: string) {
        const onlineUser = (await this.getOnlineUser(userId)) as IOnline;
        if (onlineUser) {
            try {
                await onlineUser.sendMessage(message);
            } catch (error) {
                console.log(error);
            }
        }
    }
    async findUsersInDialog(dialogId: string): Promise<IOnline[]> {
        return await this.db.find({ dialogs: { $in: [dialogId] } });
    }
}
