import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private readonly service: SessionsService) {}

    @Post()
    create(@Body() dto: CreateSessionDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSessionDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Put(':id/start')
    startLiveSession(@Param('id', ParseIntPipe) id: number) {
        return this.service.startLiveSession(id);
    }

    @Put(':id/end')
    endLiveSession(@Param('id', ParseIntPipe) id: number) {
        return this.service.endLiveSession(id);
    }
}