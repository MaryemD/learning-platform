import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messagesRepo: Repository<Message>,
        @InjectRepository(Session)
        private readonly sessionsRepo: Repository<Session>,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) {}

    async create(createDto: CreateMessageDto): Promise<Message> {
        const session = await this.sessionsRepo.findOneBy({ id: createDto.sessionId });
        if (!session) throw new NotFoundException('Session not found');

        const sender = await this.usersRepo.findOneBy({ id: createDto.senderId });
        if (!sender) throw new NotFoundException('User not found');

        const message = this.messagesRepo.create({
            content: createDto.content,
            isRead: false,
            session,
            sender,
        });
        return this.messagesRepo.save(message);
    }

    findAll(): Promise<Message[]> {
        return this.messagesRepo.find({
            relations: ['sender', 'session'],
            order: {
                timestamp: 'DESC',
            },
        });
    }

    async findOne(id: number): Promise<Message> {
        const message = await this.messagesRepo.findOne({
            where: { id },
            relations: ['sender', 'session'],
        });
        if (!message) throw new NotFoundException('Message not found');
        return message;
    }

    async update(id: number, updateDto: UpdateMessageDto): Promise<Message> {
        const message = await this.findOne(id);

        if (updateDto.sessionId !== undefined) {
            const session = await this.sessionsRepo.findOneBy({ id: updateDto.sessionId });
            if (!session) throw new NotFoundException('Session not found');
            message.session = session;
        }

        if (updateDto.senderId !== undefined) {
            const sender = await this.usersRepo.findOneBy({ id: updateDto.senderId });
            if (!sender) throw new NotFoundException('User not found');
            message.sender = sender;
        }

        const { sessionId, senderId, ...restDto } = updateDto;
        Object.assign(message, restDto);

        return this.messagesRepo.save(message);
    }

    async remove(id: number): Promise<void> {
        const message = await this.findOne(id);
        await this.messagesRepo.remove(message);
    }

    async markAsRead(id: number): Promise<Message> {
        const message = await this.findOne(id);
        message.isRead = true;
        return this.messagesRepo.save(message);
    }

    async getMessagesBySession(sessionId: number): Promise<Message[]> {
        return this.messagesRepo.find({
            where: {
                session: { id: sessionId },
            },
            relations: ['sender'],
            order: {
                timestamp: 'ASC',
            },
        });
    }

    async getMessagesByUser(userId: number): Promise<Message[]> {
        return this.messagesRepo.find({
            where: {
                sender: { id: userId },
            },
            relations: ['session'],
            order: {
                timestamp: 'DESC',
            },
        });
    }

    async getSender(messageId: number): Promise<UserEntity> {
        const message = await this.messagesRepo.findOne({
            where: { id: messageId },
            relations: ['sender'],
        });
        if (!message) throw new NotFoundException('Message not found');
        return message.sender;
    }

    async getSession(messageId: number): Promise<Session> {
        const message = await this.messagesRepo.findOne({
            where: { id: messageId },
            relations: ['session'],
        });
        if (!message) throw new NotFoundException('Message not found');
        return message.session;
    }

    async markAllMessagesAsReadForUser(sessionId: number, userId: number): Promise<void> {
        await this.messagesRepo.update(
            {
                session: { id: sessionId },
                sender: { id: userId },
                isRead: false,
            },
            { isRead: true }
        );
    }

    async getUnreadMessagesCount(sessionId: number, userId: number): Promise<number> {
        return this.messagesRepo.count({
            where: {
                session: { id: sessionId },
                sender: { id: userId },
                isRead: false,
            },
        });
    }

    async getRecentMessages(sessionId: number, limit: number = 50): Promise<Message[]> {
        return this.messagesRepo.find({
            where: {
                session: { id: sessionId },
            },
            relations: ['sender'],
            order: {
                timestamp: 'DESC',
            },
            take: limit,
        });
    }
}
