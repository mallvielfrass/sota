import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtSecret } from 'src/const';
@Module({
    imports: [
        UserService,
        JwtModule.register({
            secret: jwtSecret,

            signOptions: { expiresIn: '10m' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService],
})
export class AuthModule {}
