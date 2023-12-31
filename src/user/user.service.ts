import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto, UserResponse, constraintsDto } from './user.dto';
import { IUser, User } from './user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
    async findUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        return user;
    }
    async getAllUsers(constraints: constraintsDto) {
        const reverse = constraints.reverse ? -1 : 1;
        const users = await this.userModel
            .find()
            .sort({ _id: reverse })
            .skip(constraints.offset)
            .limit(constraints.limit)
            .select(
                '_id firstName lastName isDeleted isBanned username email avatar',
            )
            .exec();
        return users;
    }
    async createUser(
        body: {
            email: string;
            username: string;
            firstName: string;
            lastName: string;
        },
        hash: string,
    ) {
        const newUser = await this.userModel.create({
            email: body.email,
            hash: hash,
            //	username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            isDeleted: false,
            isBanned: false,
            dialogs: [],
        });
        if (!body.username || body.username == '') {
            newUser.username = newUser._id.toString();
            await newUser.save();
        }
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
            email: user.email,
            _id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            isDeleted: user.isDeleted,
            isBanned: user.isBanned,
            username: user.username,
            avatar: user.avatar,
            isMe: false,
        };
    }
}
