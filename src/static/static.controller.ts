import {
    Controller,
    Get,
    HttpException,
    Param,
    Res,
    StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import * as mime from 'mime-types';
import { StaticService } from './static.service';
@Controller('/api/static')
export class StaticController {
    constructor(private readonly staticService: StaticService) {}
    @Get('/:path')
    async getStatic(
        @Param('path') path: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        const fileInfo = await this.staticService.checkStaticFile(path);
        if (fileInfo.error) {
            console.log('getStatic error', fileInfo.error);
            throw new HttpException('Not found', 404);
        }
        console.log('fileInfo', fileInfo);
        const file = createReadStream(fileInfo.path);
        const contentType = mime.contentType(fileInfo.ext);
        if (!contentType) {
            throw new HttpException('Not found', 404);
        }
        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${path}"`,
        });
        return new StreamableFile(file);
        //return fileInfo;
    }
}
