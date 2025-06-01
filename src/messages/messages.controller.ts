import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
    constructor(private readonly service: MessagesService) {}

    @Post()
    create(@Body() dto: CreateMessageDto) {
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
        @Body() dto: UpdateMessageDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }

    @Put(':id/read')
    markAsRead(@Param('id', ParseIntPipe) id: number) {
        return this.service.markAsRead(id);
    }

    @Get('session/:sessionId')
    findBySession(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.service.getMessagesBySession(sessionId);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.service.getMessagesByUser(userId);
    }

    @Get('session/:sessionId/recent')
    getRecentMessages(
        @Param('sessionId', ParseIntPipe) sessionId: number,
        @Query('limit', ParseIntPipe) limit: number = 50
    ) {
        return this.service.getRecentMessages(sessionId, limit);
    }

    @Get('session/:sessionId/unread/:userId')
    getUnreadCount(
        @Param('sessionId', ParseIntPipe) sessionId: number,
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.service.getUnreadMessagesCount(sessionId, userId);
    }

    @Put('session/:sessionId/mark-read/:userId')
    markAllAsRead(
        @Param('sessionId', ParseIntPipe) sessionId: number,
        @Param('userId', ParseIntPipe) userId: number
    ) {
        return this.service.markAllMessagesAsReadForUser(sessionId, userId);
    }
}
