import { Inject } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

export const checkAccess = () => {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const originalMethod = descriptor.value;
        const injectYourService = Inject(SocketService);
        descriptor.value = async function (client: Socket, data: any) {
            const target: any = {};
            injectYourService(target, 'socketService');
            // const socketService = this.socketService;
            // if (!checkClientIsAuthorized(client.id)) {
            //     client.emit('auth', 'access denied');
            //     return;
            // }
            const socketService: SocketService = this.socketService;
            if (!(await socketService.checkClientIsAuthorized(client.id))) {
                client.emit('auth', { error: 'user not authorized' });
                return;
            }
            return originalMethod.call(this, client, data);
        };

        return descriptor;
    };
};
