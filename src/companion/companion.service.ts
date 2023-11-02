import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DialogDocument } from '../dialog/dialog.schema';
import { UserDocument } from '../user/user.schema';
import { Companion } from './companion.schema';

@Injectable()
export class CompanionService {
  constructor(
    @InjectModel(Companion.name)
    private readonly companionModel: Model<Companion>,
  ) {}

  async createCompanion(dialog: DialogDocument, user: UserDocument) {
    const companion = await this.companionModel.create({
      dialog: dialog,
      user: user,
    });
    return companion;
  }
  async createCompanions(chatId: string, userIds: UserDocument[]) {
    const companions = await this.companionModel.insertMany(
      userIds.map((user) => ({ chatId, userId: user._id.toString() })),
    );
    return companions;
  }
  async getCompanionByChatIdAndUserId(chatId: string, userId: string) {
    const companion = await this.companionModel.findOne({
      chatId: chatId,
      userId: userId,
    });
    return companion;
  }
  async getOrCreateCompanion(dialog: DialogDocument, user: UserDocument) {
    const companion = await this.getCompanionByChatIdAndUserId(
      dialog._id.toString(),
      user._id.toString(),
    );
    if (!companion) {
      return await this.createCompanion(dialog, user);
    }
    return companion;
  }
}
