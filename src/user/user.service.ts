import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser, User } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }
  async createUser(email: string, hash: string) {
    const newUser = await this.userModel.create({ email: email, hash: hash });
    return newUser;
  }
}
