import { Dialog, DialogSchema } from '../dialog/dialog.schema';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DialogCheckerService } from '../dialog-checker/dialogChecker.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
    imports: [
        CacheModule.register(),
        MongooseModule.forFeature([
            {
                name: Dialog.name,
                schema: DialogSchema,
            },
        ]),
    ],
    providers: [SocketGateway, SocketService, JwtService, DialogCheckerService],

    exports: [CacheModule, SocketGateway, SocketService, DialogCheckerService],
})
export class SocketModule {}
