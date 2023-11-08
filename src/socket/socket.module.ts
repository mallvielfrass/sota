import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
    providers: [SocketGateway, SocketService],
    imports: [CacheModule.register()],
    exports: [CacheModule, SocketGateway, SocketService],
})
export class SocketModule {}
