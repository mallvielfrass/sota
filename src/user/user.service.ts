import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto, UserResponse } from './user.dto';
import { IUser, User } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async findUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        return user;
    }
    async createUser(email: string, hash: string) {
        const newUser = await this.userModel.create({
            email: email,
            hash: hash,
        });
        return newUser;
    }
    async findUserById(_id: string) {
        const user = await this.userModel.findById(_id);
        return user;
    }
    async updateUser(_id: string, user: UserDto) {
        const { firstName, lastName } = user;
        const obj = {};
        if (firstName) {
            obj['firstName'] = firstName;
        }
        if (lastName) {
            obj['lastName'] = lastName;
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(_id, obj);
        return updatedUser;
    }
    convertIUserToDto(user: IUser): UserResponse {
        return {
            email: user.email.toString(),
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            isDeleted: user.isDeleted,
            isBanned: user.isBanned,
            username: user.username,
        };
    }
}
