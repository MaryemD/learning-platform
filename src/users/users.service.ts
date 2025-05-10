import {ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRoleEnum } from 'src/enums/user-role.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        private jwtService : JwtService,
    ){
        
    }
    async register(userData : UserSubscribeDto) : Promise<Partial<UserEntity>> {
        const user = this.userRepository.create({
            ...userData,
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        try {
            await this.userRepository.save(user);
        } catch (error) {
            throw new ConflictException('Username and email have to be unqiue');
        }

        return {
            id:user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        };
    }
    async login (credentials : LoginCredentialsDto)  {
        const {username, password} = credentials;
        const user = await this.userRepository.createQueryBuilder('user')
            .where('user.name = :username or user.email=:username', { username })
            .getOne();
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const hashedPassword = await bcrypt.hash(password, user.salt);
        if (hashedPassword !== user.password) {
            throw new NotFoundException('Invalid password');
        } else {
            const payload = { username: user.name, email: user.email, role: user.role };
            const jwt = await this.jwtService.signAsync(payload);
            return {
                "access_token": jwt,
            };
        }
    }
    InstructorOrAdmin(user) {
        return (user.role === UserRoleEnum.ADMIN || user.role === UserRoleEnum.INSTRUCTOR);
    }
}
