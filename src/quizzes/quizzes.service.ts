import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { CreateQuizAnswerDto } from './dto/create-quiz-answer.dto';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';
import { UserRoleEnum } from '../enums/user-role.enum';
import { GetQuizzesDto } from './dto/get-quizzes.dto';

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
    const session = await this.sessionsRepo.findOneBy({
      id: createDto.sessionId,
    });
    if (!session) throw new NotFoundException('Session not found');

    const quiz = this.quizzesRepo.create({
      title: createDto.title,
      session,
    });

    const savedQuiz = await this.quizzesRepo.save(quiz);

    if (createDto.questions?.length) {
      const questions = createDto.questions.map((q) =>
        this.questionsRepo.create({
          ...q,
          quiz: savedQuiz,
        }),
      );
      await this.questionsRepo.save(questions);
      savedQuiz.questions = questions;
    }

    const createdQuiz = await this.quizzesRepo.findOne({
      where: { id: savedQuiz.id },
      relations: ['session', 'questions', 'session.instructor'],
    });

    if (!createdQuiz) {
      throw new NotFoundException(`Failed to create quiz`);
    }

    return createdQuiz;
  }

  async createQuestion(
    quizId: number,
    createDto: CreateQuizQuestionDto,
  ): Promise<QuizQuestion> {
    const quiz = await this.findOne(quizId);

    const question = this.questionsRepo.create({
      questionText: createDto.questionText,
      options: createDto.options,
      correctAnswerIndex: createDto.correctAnswerIndex,
      quiz,
    });
    return this.questionsRepo.save(question);
  }

  async saveQuiz(quiz: Quiz): Promise<Quiz> {
    return this.quizzesRepo.save(quiz);
  }

  async evaluateAnswer(quizId: number, questionId: number, selectedOptionIndex: number): Promise<boolean> {
    const question = await this.questionsRepo.findOne({
      where: { id: questionId, quiz: { id: quizId } },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return question.correctAnswerIndex === selectedOptionIndex;
  }

  async createAnswer(createDto: CreateQuizAnswerDto): Promise<QuizAnswer> {
    const [quiz, user] = await Promise.all([
      this.findOne(createDto.quizId),
      this.usersRepo.findOneBy({ id: createDto.userId }),
    ]);

    if (!user) throw new NotFoundException('User not found');

    // Fetch question with quiz relation
    const question = await this.questionsRepo.findOne({
      where: { id: createDto.questionId },
      relations: ['quiz']
    });

    if (!question) throw new NotFoundException('Question not found');
    if (question.quiz.id !== quiz.id) {
      throw new BadRequestException(
        'Question does not belong to the specified quiz',
      );
    }

    const answer = this.answersRepo.create({
      questionId: createDto.questionId,
      selectedOptionIndex: createDto.selectedOptionIndex,
      quiz,
      user,
    });
    return this.answersRepo.save(answer);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizzesRepo.find({
      relations: ['session', 'questions', 'answers', 'questions.quiz'],
    });
  }

  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizzesRepo.findOne({
      where: { id },
      relations: ['session', 'questions', 'answers', 'questions.quiz'],
    });
    if (!quiz) throw new NotFoundException(`Quiz #${id} not found`);
    return quiz;
  }

  async update(id: number, updateDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);

    if (updateDto.sessionId !== undefined) {
      const session = await this.sessionsRepo.findOneBy({
        id: updateDto.sessionId,
      });
      if (!session) throw new NotFoundException('Session not found');
      quiz.session = session;
    }

    if (updateDto.questions) {
      // Remove existing questions
      await this.questionsRepo.delete({ quiz: { id } });

      // Create new questions
      const questions = updateDto.questions.map(q =>
        this.questionsRepo.create({
          ...q,
          quiz,
        })
      );
      await this.questionsRepo.save(questions);
      quiz.questions = questions;
    }

    const { sessionId, questions, ...restDto } = updateDto;
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
      relations: ['session', 'questions', 'answers', 'questions.quiz'],
    });
  }

  async getQuizzesByInstructor(instructorId: number): Promise<Quiz[]> {
    const instructor = await this.usersRepo.findOneBy({ id: instructorId });
    if (!instructor) throw new NotFoundException('Instructor not found');
    if (instructor.role !== UserRoleEnum.INSTRUCTOR) {
      throw new ForbiddenException('User is not an instructor');
    }

    return this.quizzesRepo.find({
      where: { session: { instructor: { id: instructorId } } },
      relations: ['session', 'questions', 'answers', 'questions.quiz'],
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
      relations: ['quiz'],
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

  async getStudentAnswers(quizId: number, userId: number): Promise<QuizAnswer[]> {
    const quiz = await this.findOne(quizId);
    const user = await this.usersRepo.findOneBy({ id: userId });
    
    if (!user) throw new NotFoundException('User not found');

    return this.answersRepo.find({
      where: {
        quiz: { id: quizId },
        user: { id: userId },
      },
      relations: ['quiz', 'user'],
    });
  }

  async addQuestionsToQuiz(
    quizId: number,
    questionIds: number[],
  ): Promise<Quiz> {
    const quiz = await this.findOne(quizId);
    const questions = await this.questionsRepo.findByIds(questionIds);

    questions.forEach((question) => {
      question.quiz = quiz;
    });

    await this.questionsRepo.save(questions);
    return this.findOne(quizId);
  }

  async calculateQuizResults(quizId: number) {
    const quiz = await this.findOne(quizId);
    const answers = await this.answersRepo.find({
      where: { quiz: { id: quizId } },
      relations: ['user'],
    });

    // Group answers by user
    const userAnswers = answers.reduce((acc, answer) => {
      if (!acc[answer.user.id]) {
        acc[answer.user.id] = {
          userId: answer.user.id,
          correctAnswers: 0,
          totalAnswers: 0,
          score: 0,
        };
      }

      const question = quiz.questions.find(q => q.id === answer.questionId);
      if (question && question.correctAnswerIndex === answer.selectedOptionIndex) {
        acc[answer.user.id].correctAnswers++;
      }
      acc[answer.user.id].totalAnswers++;

      return acc;
    }, {} as Record<number, {
      userId: number;
      correctAnswers: number;
      totalAnswers: number;
      score: number;
    }>);

    // Calculate scores
    Object.values(userAnswers).forEach(userResult => {
      userResult.score = (userResult.correctAnswers / quiz.questions.length) * 100;
    });

    return Object.values(userAnswers);
  }

  async isQuizCompleted(quizId: number, userId: number): Promise<boolean> {
    const quiz = await this.findOne(quizId);
    const answers = await this.getStudentAnswers(quizId, userId);
    
    return answers.length === quiz.questions.length;
  }

  async getAllQuizzes(getQuizzesDto: GetQuizzesDto) {
    const { page = 1, limit = 10, search, sessionId } = getQuizzesDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.quizzesRepo.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.session', 'session')
      .leftJoinAndSelect('quiz.questions', 'questions')
      .leftJoin('session.instructor', 'instructor')
      .addSelect(['instructor.id', 'instructor.name', 'instructor.role']);

    if (search) {
      queryBuilder.andWhere('quiz.title LIKE :search', { search: `%${search}%` });
    }

    if (sessionId) {
      queryBuilder.andWhere('session.id = :sessionId', { sessionId });
    }

    queryBuilder
      .orderBy('quiz.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [quizzes, total] = await queryBuilder.getManyAndCount();

    return {
      items: quizzes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }
}
