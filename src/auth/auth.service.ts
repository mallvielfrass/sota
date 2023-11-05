import { expireJwtShiftSeconds, jwtSecret } from 'src/const';
import { ComparePassword, EncryptPassword } from 'src/utils/crypto/crypto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { DialogService } from '../dialog/dialog.service';
import { UserCreateDto } from './auth.dto';

//import { IUser } from 'src/database/user.schema';
interface responseUser {
    success: boolean;
    User: IUser;
    token: string;
}
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        private dialogService: DialogService,
    ) {}
    async createUserJWT(
        email: string,
        password: string,
    ): Promise<responseUser> {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            return {
                success: false,
                User: null,
                token: null,
            };
        }
        if (!ComparePassword(password, user.hash)) {
            return {
                success: false,
                token: null,
                User: null,
            };
        }

        const payload = {
            userId: user._id.toString(),
            email: user.email,
            expires: Math.floor(Date.now() / 1000) + expireJwtShiftSeconds,
        };
        const access_token = this.jwtService.sign(payload, {
            secret: jwtSecret,
        });
        return {
            success: true,
            User: user,
            token: access_token,
        };
    }
    async checkUserExists(email: string): Promise<boolean> {
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            return true;
        }
        return false;
    }
    async register(body: UserCreateDto): Promise<responseUser> {
        const { email, password } = body;
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            return {
                success: false,
                User: null,
                token: null,
            };
        }
        const hash = await EncryptPassword(password);
        const newUser = await this.userService.createUser(body, hash);

        await this.dialogService.getOrCreatePrivateDialog(
            newUser._id.toString(),
            newUser._id.toString(),
        );
        return {
            success: true,
            User: newUser,
            token: null,
        };
    }
    async getUserById(_id: string): Promise<NonNullable<IUser>> {
        const user = await this.userService.findUserById(_id);
        return user;
    }
}
