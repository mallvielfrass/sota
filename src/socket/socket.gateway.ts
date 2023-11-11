import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { checkAccess } from './socket.decorators';
import { SocketService } from './socket.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class SocketGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    constructor(private readonly socketService: SocketService) {}
    @WebSocketServer() server: Server;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    afterInit(server: Server) {
        console.log('Init socket server');
        this.socketService.initService(server);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
        this.socketService.handleDisconnect(client);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleConnection(client: Socket, ...args: any[]) {
        console.log(`Client connected: ${client.id}`);
        this.socketService.handleConnection(client);
    }
    //events:
    @SubscribeMessage('auth')
    async handleAuth(client: Socket, data: any) {
        console.log(`Client ${client.id} sent: [${data}]`);
        await this.socketService.auth(client, data);
        //  client.emit('auth', 'hello from server');
    }
    @SubscribeMessage('check')
    @checkAccess()
    async handleCheck(client: Socket, data: any) {
        console.log(`Client ${client.id} sent: [${data}]`);
        client.emit('check', 'ok');
    }

    @SubscribeMessage('msgToServer')
    handleMesToServer(client: Socket, payload: string): void {
        console.log(`Message received: ${payload}`);
        client.emit('msgToClient', payload);
    }
    @SubscribeMessage('message')
    handleMessage(client: Socket, data: any): void {
        console.log(`Client ${client.id} sent: [${data}]`);
        client.emit('message', 'hello from server');
    }
    @SubscribeMessage('join')
    @checkAccess()
    async handleJoin(client: Socket, data: any) {
        this.socketService.joinRoom(client, data);
    }
}

// @WebSocketGateway({
//     cors: {
//         origin: '*',
//     },
// })
// export class SocketGateway implements OnGatewayConnection {
//     @WebSocketServer()
//     private server: Socket;

//     constructor(private readonly socketService: SocketService) {}

//     handleConnection(socket: Socket): void {
//         this.socketService.handleConnection(socket);
//     }

//     // Implement other Socket.IO event handlers and message handlers
// }
// // socket.gateway.ts
// import {
//     MessageBody,
//     OnGatewayInit,
//     SubscribeMessage,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';

// @WebSocketGateway()
// export class SocketGateway implements OnGatewayInit {
//     @WebSocketServer()
//     server: Server;

//     afterInit(server: Server) {
//         server.on('connection', (socket) => {
//             console.log('Client connected:', socket.id);
//         });
//         // Вызывается после инициализации сервера Socket.IO
//     }

//     @SubscribeMessage('message')
//     handleMessage(@MessageBody() data: string): string {
//         // Обработка входящего сообщения
//         return data;
//     }
// }
