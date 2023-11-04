import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { DialogService } from '../dialog/dialog.service';
import { MessageDto } from './message.dto';
import { MessageService } from './message.service';

@Controller('/api/message')
@UseGuards(AuthGuard)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly dialogService: DialogService,
    ) {}
    //create self message
    @Post('/self')
    async createSelfMessage(@Body() body: MessageDto, @Req() req: Request) {
        const payload = req['user'];
        const { userId } = payload;
        const dialog = await this.dialogService.getPrivateChat(userId, userId);
        const msg = await this.messageService.createMessage(
            dialog._id.toString(),
            userId,
            body,
        );
        return { message: msg };
    }
    //create new message for /:dialogId
    @Post('/:dialogId')
    async createMessage(
        @Param('dialogId') dialogId: string,
        @Body() body: MessageDto,
        @Req() req: Request,
    ) {
        const payload = req['user'];
        const { userId } = payload;
        const msg = await this.messageService.createMessage(
            dialogId,
            userId,
            body,
        );
        return { message: msg };
    }
}
