import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CompanionSchema } from './companion/companion.schema';
import { CompanionService } from './companion/companion.service';
import { db_url } from './const';
import { DialogCheckerService } from './dialog-checker/dialogChecker.service';
import { DialogController } from './dialog/dialog.controller';
import { DialogSchema } from './dialog/dialog.schema';
import { DialogService } from './dialog/dialog.service';
import { DialogAdmin } from './dialogAdmin/dialogAdmin.scheme';
import { DialogAdminService } from './dialogAdmin/dialogAdmin.service';
import { MessageCounterService } from './message-counter/message-counter.service';
import { MessageController } from './message/message.controller';
import { MessageSchema } from './message/message.schema';
import { MessageService } from './message/message.service';
import { SocketModule } from './socket/socket.module';
import { StaticController } from './static/static.controller';
import { StaticService } from './static/static.service';
import { UserController } from './user/user.controller';
import { UserSchema } from './user/user.schema';
import { UserService } from './user/user.service';
import { UserCoreService } from './user/userCore.service';

@Module({
    imports: [
        MongooseModule.forRoot(db_url),
        MongooseModule.forFeature([
            {
                name: 'User',
                schema: UserSchema,
            },
            {
                name: 'Dialog',
                schema: DialogSchema,
            },
            {
                name: 'Companion',
                schema: CompanionSchema,
            },
            {
                name: 'Message',
                schema: MessageSchema,
            },
            {
                name: DialogAdmin.name,
                schema: DialogSchema,
            },
        ]),
        SocketModule,
    ],
    controllers: [
        AppController,
        AuthController,
        UserController,
        DialogController,
        MessageController,
        StaticController,
    ],
    providers: [
        AppService,
        AuthService,
        UserService,
        JwtService,
        DialogService,
        DialogAdminService,
        CompanionService,
        UserCoreService,
        MessageService,
        MessageCounterService,
        StaticService,
        DialogCheckerService,
    ],
})
export class AppModule {}
