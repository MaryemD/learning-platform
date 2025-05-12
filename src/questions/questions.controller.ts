import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly service: QuestionsService) {}

    @Post()
    create(@Body() dto: CreateQuestionDto) {
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
        @Body() dto: UpdateQuestionDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Put(':id/answer')
    markAsAnswered(@Param('id', ParseIntPipe) id: number) {
        return this.service.markAsAnswered(id);
    }

    @Get('session/:sessionId')
    findBySession(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.service.getQuestionsBySession(sessionId);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.getQuestionsByUser(userId);
    }
}