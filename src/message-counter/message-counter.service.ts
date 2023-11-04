import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialog } from '../dialog/dialog.schema';

@Injectable()
export class MessageCounterService {
    constructor(
        //  @InjectModel(MessageCounter.name)
        //  private readonly messageCounterModel: Model<MessageCounter>,
        @InjectModel(Dialog.name)
        private readonly dialogModel: Model<Dialog>,
    ) {}

    async getNewMessageCount(dialogId: string): Promise<number> {
        const result = await this.dialogModel.findOneAndUpdate(
            { _id: dialogId },
            { $inc: { msgCount: 1 } },
            //return new Object
            { returnOriginal: false },

            //{ returnOriginal: false, upsert: true },
        );

        return result.msgCount;
    }
}
