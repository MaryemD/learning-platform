import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
dotenv.config();
@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
            secret: process.env.SECRET,
            signOptions: { expiresIn: '1h' },
})],
    controllers: [UserController],
    providers: [UserService,JwtStrategy],
    exports: [UserService],
})
export class UserModule {}
