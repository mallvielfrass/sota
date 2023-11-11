import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { DialogCheckerService } from '../dialog-checker/dialogChecker.service';
import { DialogService } from '../dialog/dialog.service';
import { MessageDto, constraintsDto } from './message.dto';
import { MessageService } from './message.service';

@Controller('/api/message')
@UseGuards(AuthGuard)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly dialogService: DialogService,
        private readonly dialogCheckerService: DialogCheckerService,
    ) {}
    //create self message
    @Post('/self')
    async createSelfMessage(@Body() body: MessageDto, @Req() req: Request) {
        const payload = req['user'];
        const { userId } = payload;
        const dialog = await this.dialogService.getPrivateChat(userId, userId);
        const res = await this.messageService.createMessage(
            dialog._id.toString(),
            userId,
            body,
        );
        return { message: res.message };
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
        const res = await this.messageService.createMessage(
            dialogId,
            userId,
            body,
        );
        if (res.error) {
            throw new HttpException(res.error, 400);
        }
        return { message: res.message };
    }

    //get messages for /:dialogId with pagination constraintsDto
    @Get('/:dialogId')
    async getMessagesByDialogId(
        @Param('dialogId') dialogId: string,
        @Req() req: Request,
        @Body() constDto: constraintsDto,
    ) {
        const payload = req['user'];
        const { userId } = payload;
        const checkUserInDialog =
            await this.dialogCheckerService.checkUserInDialog(dialogId, userId);
        if (!checkUserInDialog) {
            throw new HttpException('Not found', 404);
        }
        const messages = await this.messageService.getMessagesByDialogId(
            dialogId,
            userId,
            constDto,
        );
        return { messages };
    }
}
