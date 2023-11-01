import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserCoreService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findUserById(_id: string) {
    const user = await this.userModel.findById(_id);
    return user;
  }
}
