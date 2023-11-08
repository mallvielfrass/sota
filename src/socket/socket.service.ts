import { Server, Socket } from 'socket.io';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();
    private server: Server;
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
    initService(server: Server): void {
        this.server = server;
    }
    handleConnection(client: Socket) {
        this.connectedClients.set(client.id, client);
    }
    handleDisconnect(client: Socket) {
        this.connectedClients.delete(client.id);
    }

    async auth(client: Socket, data: any): Promise<void> {
        console.log(`Client ${client.id} sent: [${data}]`);
        //const user = await this.cacheManager.get(`user:${data}`);
    }
    // handleConnection(socket: Socket): void {
    //     const clientId = socket.id;
    //     this.server = socket;
    //     this.connectedClients.set(clientId, socket);
    //     socket.on('connect', () => {
    //         console.log('Client connected:', clientId);
    //         socket.emit('message', 'connected to server');
    //     });
    //     socket.on('disconnect', () => {
    //         this.connectedClients.delete(clientId);
    //     });
    //     socket.on('message', (data) => {
    //         console.log(`Client ${clientId} sent: [${data}]`);
    //         socket.emit('message', 'hello from server');
    //     });
    //     socket.on('join', async (data) => {
    //         try {
    //             console.log('data', data);
    //             const room = typeof data === 'string' ? JSON.parse(data) : data;
    //             console.log('room', room);
    //             const roomId = room.room;
    //             // console.log('roomId', roomId);
    //             await socket.join(roomId);
    //             //  console.log('joined', data);
    //             // socket.emit('message', `joined room ${roomId}`);
    //             this.server.to(roomId).emit('room', `joined room ${roomId}`);
    //             //    socket.emit('message', `joined room ${room}`);
    //         } catch (error) {
    //             console.log('error', error);
    //         }
    //     });
    //     // Handle other events and messages from the client
    // }
    async emitNewMessageToDialog(
        dialogId: string,
        userId: string,
        message: object,
    ) {
        console.log('emiting to dialog', dialogId, userId, message);
        const status = this.server.to(dialogId).emit('message', message);
        console.log('status', status);
    }
    // Add more methods for handling events, messages, etc.
}
