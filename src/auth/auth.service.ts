import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { ComparePassword, EncryptPassword } from 'src/utils/crypto/crypto';
import { JwtService } from '@nestjs/jwt';
import { expireJwtShiftSeconds, jwtSecret } from 'src/const';
//import { IUser } from 'src/database/user.schema';
interface responseUser {
    success: boolean;
    User: UserDocument;
    token: string;
}
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
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
    async register(email: string, password: string): Promise<responseUser> {
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            return {
                success: false,
                User: null,
                token: null,
            };
        }
        const hash = await EncryptPassword(password);
        const newUser = await this.userService.createUser(email, hash);
        return {
            success: true,
            User: newUser,
            token: null,
        };
    }
}
