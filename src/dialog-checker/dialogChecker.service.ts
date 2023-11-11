import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dialog } from '../dialog/dialog.schema';

@Injectable()
export class DialogCheckerService {
    constructor(
        @InjectModel(Dialog.name) private readonly dialogModel: Model<Dialog>,
    ) {}
    async checkUserInDialog(
        dialogId: string,
        userId: string,
    ): Promise<boolean> {
        const dialog = await this.dialogModel.findOne({
            _id: dialogId,
            $and: [
                {
                    companions: {
                        $elemMatch: {
                            userId: userId,
                        },
                    },
                },
            ],
        });
        if (!dialog) {
            return false;
        }
        return true;
    }
}
