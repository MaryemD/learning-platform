import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(Quiz)
        private readonly quizzesRepo: Repository<Quiz>,
        @InjectRepository(QuizQuestion)
        private readonly questionsRepo: Repository<QuizQuestion>,
        @InjectRepository(QuizAnswer)
        private readonly answersRepo: Repository<QuizAnswer>,
        @InjectRepository(Session)
        private readonly sessionsRepo: Repository<Session>,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) {}

    async create(createDto: CreateQuizDto): Promise<Quiz> {
        const session = await this.sessionsRepo.findOneBy({ id: createDto.sessionId });
        if (!session) throw new NotFoundException('Session not found');

        const quiz = this.quizzesRepo.create({
            title: createDto.title,
            session,
        });

        const savedQuiz = await this.quizzesRepo.save(quiz);

        if (createDto.questions?.length) {
            const questions = createDto.questions.map(q => 
                this.questionsRepo.create({
                    ...q,
                    quiz: savedQuiz
                })
            );
            await this.questionsRepo.save(questions);
        }

        return this.findOne(savedQuiz.id);
    }

    async createQuestion(quizId: number, createDto: CreateQuizQuestionDto): Promise<QuizQuestion> {
        const quiz = await this.findOne(quizId);

        const question = this.questionsRepo.create({
            questionText: createDto.questionText,
            options: createDto.options,
            correctAnswerIndex: createDto.correctAnswerIndex,
            quiz,
        });
        return this.questionsRepo.save(question);
    }

    async createAnswer(createDto: CreateQuizAnswerDto): Promise<QuizAnswer> {
        const [quiz, user, question] = await Promise.all([
            this.findOne(createDto.quizId),
            this.usersRepo.findOneBy({ id: createDto.userId }),
            this.questionsRepo.findOneBy({ id: createDto.questionId })
        ]);

        if (!user) throw new NotFoundException('User not found');
        if (!question) throw new NotFoundException('Question not found');
        if (question.quiz.id !== quiz.id) {
            throw new BadRequestException('Question does not belong to the specified quiz');
        }

        const answer = this.answersRepo.create({
            questionId: createDto.questionId,
            selectedOptionIndex: createDto.selectedOptionIndex,
            quiz,
            user,
        });
        return this.answersRepo.save(answer);
    }

    findAll(): Promise<Quiz[]> {
        return this.quizzesRepo.find({
            relations: ['session', 'questions', 'answers'],
        });
    }

    async findOne(id: number): Promise<Quiz> {
        const quiz = await this.quizzesRepo.findOne({
            where: { id },
            relations: ['session', 'questions', 'answers'],
        });
        if (!quiz) throw new NotFoundException(`Quiz #${id} not found`);
        return quiz;
    }

    async update(id: number, updateDto: UpdateQuizDto): Promise<Quiz> {
        const quiz = await this.findOne(id);

        if (updateDto.sessionId !== undefined) {
            const session = await this.sessionsRepo.findOneBy({ id: updateDto.sessionId });
            if (!session) throw new NotFoundException('Session not found');
            quiz.session = session;
        }

        const { sessionId, ...restDto } = updateDto;
        Object.assign(quiz, restDto);

        return this.quizzesRepo.save(quiz);
    }

    async remove(id: number): Promise<void> {
        const quiz = await this.findOne(id);
        await this.quizzesRepo.remove(quiz);
    }

    async getQuizzesBySession(sessionId: number): Promise<Quiz[]> {
        const session = await this.sessionsRepo.findOneBy({ id: sessionId });
        if (!session) throw new NotFoundException('Session not found');

        return this.quizzesRepo.find({
            where: { session: { id: sessionId } },
            relations: ['session', 'questions', 'answers'],
        });
    }

    async getSession(quizId: number): Promise<Session> {
        const quiz = await this.quizzesRepo.findOne({
            where: { id: quizId },
            relations: ['session', 'session.instructor'],
        });

        if (!quiz) throw new NotFoundException(`Quiz #${quizId} not found`);
        return quiz.session;
    }

    async getQuestions(quizId: number): Promise<QuizQuestion[]> {
        const quiz = await this.findOne(quizId);
        return this.questionsRepo.find({
            where: { quiz: { id: quiz.id } },
        });
    }

    async getQuestion(questionId: number): Promise<QuizQuestion> {
        const question = await this.questionsRepo.findOne({
            where: { id: questionId },
            relations: ['quiz'],
        });

        if (!question) {
            throw new NotFoundException(`Question #${questionId} not found`);
        }

        return question;
    }

    async getInstructor(quizId: number): Promise<UserEntity> {
        const quiz = await this.quizzesRepo.findOne({
            where: { id: quizId },
            relations: ['session', 'session.instructor'],
        });
    
        if (!quiz) {
            throw new NotFoundException(`Quiz #${quizId} not found`);
        }
        
        if (!quiz.session?.instructor) {
            throw new NotFoundException(`Instructor not found for quiz #${quizId}`);
        }
    
        return quiz.session.instructor;
    }

    async addQuestionsToQuiz(quizId: number, questionIds: number[]): Promise<Quiz> {
        const quiz = await this.findOne(quizId);
        const questions = await this.questionsRepo.findByIds(questionIds);
        
        questions.forEach(question => {
            question.quiz = quiz;
        });
        
        await this.questionsRepo.save(questions);
        return this.findOne(quizId);
    }
}