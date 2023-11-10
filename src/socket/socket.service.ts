import { Server, Socket } from 'socket.io';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { jwtSecret } from '../const';
import {
    anyToJson,
    validateAndParseDto,
} from '../utils/validation/dtoValidator';
import { AuthorizationDto } from './socket.dto';
import { Payload } from './socket.types';

@Injectable()
export class SocketService {
    private readonly connectedClients: Map<string, Socket> = new Map();
    private server: Server;
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private jwtService: JwtService,
    ) {}
    initService(server: Server): void {
        this.server = server;
    }
    handleConnection(client: Socket) {
        this.connectedClients.set(client.id, client);
    }
    handleDisconnect(client: Socket) {
        this.connectedClients.delete(client.id);
    }
    async checkClientIsAuthorized(clientId: string) {
        //   console.log('checkClientIsAuthorized>:', clientId);
        const user = await this.cacheManager.get(`${clientId}`);
        //   console.log('checkClientIsAuthorized> user', user);
        return !!user;
    }
    async auth(client: Socket, data: any): Promise<void> {
        console.log(`Client ${client.id} sent: [${data}]`);
        const jsBody = anyToJson(data);
        if (jsBody.error) {
            console.log('error', jsBody.error);
            client.emit('auth', { error: 'invalid json object' });
            return;
        }

        const parseResp = await validateAndParseDto(
            AuthorizationDto,
            jsBody.data,
        );
        if (!parseResp.status) {
            client.emit('auth', {
                error: 'invalid dto type',
                reason: parseResp.error,
            });
            return;
        }
        const body = parseResp.Data;
        const token = body.Authorization.split(' ')[1];
        const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtSecret,
        });
        if (!payload) {
            client.emit('auth', { error: 'invalid token' });
            return;
        }
        const user = payload as Payload;
        await this.cacheManager.set(`${client.id}`, user, 4 * 60 * 60 * 1000);
        //  const checkUser = await this.cacheManager.get(`${client.id}`);
        //     console.log(`auth> checkUser :client:${client.id}:`, checkUser);
        client.emit('auth', { status: 'success', user: user });
        //const user = await this.cacheManager.get(`client:${data}`);
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
