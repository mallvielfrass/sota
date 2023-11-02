import { DialogSchema } from './dialog/dialog.schema';

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
import { DialogController } from './dialog/dialog.controller';
import { DialogService } from './dialog/dialog.service';
import { DialogAdmin } from './dialogAdmin/dialogAdmin.scheme';
import { MessageSchema } from './messages/message.schema';
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
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    DialogController,
  ],
  providers: [
    AppService,
    AuthService,
    UserService,
    JwtService,
    DialogService,
    CompanionService,
    UserCoreService,
  ],
})
export class AppModule {}
