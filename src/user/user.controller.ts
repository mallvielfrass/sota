import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserResponse, constraintsDto } from './user.dto';
import { UserService } from './user.service';
@Controller('/api/user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}
    // allUsersList
    @Get('/')
    async listUsers(@Req() req: Request, @Body() body: constraintsDto) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        const users = await this.userService.getAllUsers(body);
        const uResp: UserResponse[] = users.map((u) => {
            return this.userService.convertIUserToDto(u);
        });
        return { users: uResp };
    }
    @Get('/self')
    async getUser(@Req() req) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        const user = await this.userService.findUserById(userId);
        if (!user) {
            throw new HttpException('Not found', 404);
        }
        return { user: this.userService.convertIUserToDto(user) };
    }
    @Get('/:id')
    async getUserById(@Req() req, @Param('id') id) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        const user = await this.userService.findUserById(id);
        if (!user) {
            throw new HttpException('Not found', 404);
        }
        return { user: this.userService.convertIUserToDto(user) };
    }
    @Put('/')
    async updateUser(@Req() req) {
        const payload = req['user'];
        const { userId } = payload;
        if (!userId) {
            throw new HttpException('Not found', 404);
        }
        const user = await this.userService.updateUser(userId, req.body);
        if (!user) {
            throw new HttpException('Not found', 404);
        }
        return { user: this.userService.convertIUserToDto(user) };
    }
}
