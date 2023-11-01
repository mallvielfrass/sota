import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { db_url, jwtSecret } from './const';
import { UserSchema } from './user/user.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserController } from './user/user.controller';
import { DialogController } from './dialog/dialog.controller';
import { DialogService } from './dialog/dialog.service';
import { DialogSchema } from './dialog/dialog.schema';
import { CompanionSchema } from './companion/companion.schema';
import { MessageSchema } from './messages/message.schema';
import { CompanionService } from './companion/companion.service';
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
