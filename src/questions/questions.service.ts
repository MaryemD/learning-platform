import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private readonly questionsRepo: Repository<Question>,
        @InjectRepository(Session)
        private readonly sessionsRepo: Repository<Session>,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) {}

    async create(createDto: CreateQuestionDto): Promise<Question> {
        const session = await this.sessionsRepo.findOneBy({ id: createDto.sessionId });
        if (!session) throw new NotFoundException('Session not found');

        const user = await this.usersRepo.findOneBy({ id: createDto.userId });
        if (!user) throw new NotFoundException('User not found');

        const question = this.questionsRepo.create({
            content: createDto.content,
            answered: false,
            session,
            user,
        });
        return this.questionsRepo.save(question);
    }

    findAll(): Promise<Question[]> {
        return this.questionsRepo.find();
    }

    async findOne(id: number): Promise<Question> {
        const question = await this.questionsRepo.findOne({
            where: { id },
            relations: ['session', 'user'],
        });
        if (!question) throw new NotFoundException(`Question #${id} not found`);
        return question;
    }

    async update(id: number, updateDto: UpdateQuestionDto): Promise<Question> {
        const question = await this.findOne(id);

        if (updateDto.sessionId !== undefined) {
            const session = await this.sessionsRepo.findOneBy({ id: updateDto.sessionId });
            if (!session) throw new NotFoundException('Session not found');
            question.session = session;
        }

        if (updateDto.userId !== undefined) {
            const user = await this.usersRepo.findOneBy({ id: updateDto.userId });
            if (!user) throw new NotFoundException('User not found');
            question.user = user;
        }

        // Filter out sessionId and userId since they are not columns
        const { sessionId, userId, ...restDto } = updateDto;
        Object.assign(question, restDto);

        return this.questionsRepo.save(question);
    }

    async remove(id: number): Promise<void> {
        const question = await this.findOne(id);
        await this.questionsRepo.remove(question);
    }

    async markAsAnswered(id: number): Promise<Question> {
        const question = await this.findOne(id);
        question.answered = true;
        return this.questionsRepo.save(question);
    }

    async getQuestionsBySession(sessionId: number): Promise<Question[]> {
        return this.questionsRepo.find({
            where: {
                session: { id: sessionId },
            },
            relations: ['user'],
        });
    }

    async getQuestionsByUser(userId: number): Promise<Question[]> {
        return this.questionsRepo.find({
            where: {
                user: { id: userId },
            },
            relations: ['session'],
        });
    }

    async getUser(questionId: number): Promise<UserEntity> {
        const question = await this.questionsRepo.findOne({
            where: { id: questionId },
            relations: ['user'],
        });

        if (!question) throw new NotFoundException(`Question #${questionId} not found`);
        return question.user;
    }

    async getSession(questionId: number): Promise<Session> {
        const question = await this.questionsRepo.findOne({
            where: { id: questionId },
            relations: ['session'],
        });

        if (!question) throw new NotFoundException(`Question #${questionId} not found`);
        return question.session;
    }
}