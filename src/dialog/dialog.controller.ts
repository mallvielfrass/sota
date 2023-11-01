import {
  Controller,
  HttpException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DialogService } from './dialog.service';

@Controller('/api/dialog')
@UseGuards(AuthGuard)
export class DialogController {
  constructor(private readonly dialogService: DialogService) {}
  //createDialog
  @Post('/:companionId')
  async createDialog(@Req() req, @Param('companionId') companionId) {
    const payload = req['user'];
    const { userId } = payload;
    if (!userId) {
      throw new HttpException('Not found', 404);
    }
    // const finded = await this.dialogService.getPrivateChat(userId, companionId);
    // if (finded) {
    //   throw new HttpException('Already exist', 400);
    // }
    const res = await this.dialogService.createPrivateDialog(
      userId,
      companionId,
    );
    if (res.error) {
      throw new HttpException(res.error, 400);
    }
    return res;
  }
}
