import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { LoginDto, UserCreateDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    async login(@Body() body: LoginDto) {
        const res = await this.authService.createUserJWT(
            body.email,
            body.password,
        );
        if (!res.success) {
            throw new HttpException('Invalid credentials', 401);
        }
        return {
            token: res.token,
            status: 'success',
            user: {
                email: res.User.email.toString(),
                _id: res.User._id.toString(),
            },
        };
    }
    @Post('register')
    async register(@Body() body: UserCreateDto) {
        const created = await this.authService.register(body);
        if (!created.success) {
            throw new HttpException('user already exist', 401);
        }
        const res = await this.authService.createUserJWT(
            body.email,
            body.password,
        );
        if (!res.success) {
            throw new HttpException('Invalid credentials', 401);
        }
        return {
            token: res.token,
            status: 'success',
            user: {
                email: res.User.email.toString(),
                _id: res.User._id.toString(),
            },
        };
    }

    @UseGuards(AuthGuard)
    @Get('check')
    async check(@Req() req) {
        if (!req.user) {
            throw new HttpException('Not found', 404);
        }
        const user = await this.authService.getUserById(req.user.userId);
        if (!user) {
            throw new HttpException('Not found', 404);
        }

        return {
            status: 'success',
            token: req.user,
        };
    }
}
