import { Body, Controller, Post,Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserSubscribeDto } from './dto/user-subscribe.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './users.service';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { getegid } from 'process';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService,
    ) {}
    @Post()
    register(@Body () userData : UserSubscribeDto) : Promise<Partial<UserEntity>> {
        return this.userService.register(userData);
    }

    @Post('login')
    login(@Body() credentials : LoginCredentialsDto){
        return this.userService.login(credentials);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(){
        return this.userService.findAll();
    }
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getUserById(@Param('id', ParseIntPipe) id:number)
    {
        return this.userService.findOneById(id)
    }
    
}
