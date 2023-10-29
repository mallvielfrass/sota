import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { UserResponse } from './auth.model';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  async login(@Body() body: LoginDto) {
    const res = await this.authService.createUserJWT(body.email, body.password);
    if (!res.success) {
      throw new HttpException('Invalid credentials', 401);
    }
    return {
      token: res.token,
      user: {
        email: res.User.email.toString(),
        _id: res.User._id.toString(),
      },
    };
  }
  @Post('register')
  async register(@Body() body: LoginDto) {
    const created = await this.authService.register(body.email, body.password);
    if (!created.success) {
      throw new HttpException('user already exists', 401);
    }
    const res = await this.authService.createUserJWT(body.email, body.password);
    if (!res.success) {
      throw new HttpException('Invalid credentials', 401);
    }
    return {
      token: res.token,
      user: {
        email: res.User.email.toString(),
        _id: res.User._id.toString(),
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('check')
  async check(@Req() req) {
    return req.user;
  }
}
