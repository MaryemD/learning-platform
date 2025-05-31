import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CreateQuizQuestionDto } from './dto/create-quiz-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoleEnum } from '../enums/user-role.enum';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { GetQuizzesDto } from './dto/get-quizzes.dto';
import { Session } from '../sessions/entities/session.entity';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(
    private readonly quizzesService: QuizzesService,
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  @Get('all')
  async getAllQuizzes(@Query() getQuizzesDto: GetQuizzesDto) {
    return this.quizzesService.getAllQuizzes(getQuizzesDto);
  }

  @Post()
  async createQuiz(
    @Body() createQuizDto: CreateQuizDto,
    @User() user: UserEntity,
  ) {
    
    // First find the session with instructor relation
    const session = await this.sessionsRepo.findOne({
      where: { id: createQuizDto.sessionId },
      relations: ['instructor'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.instructor.email !== user.email) {
      throw new ForbiddenException('You do not have access to this session');
    }

    return this.quizzesService.create(createQuizDto);
  }

  @Post(':id/questions')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.INSTRUCTOR)
  async addQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() createQuestionDto: CreateQuizQuestionDto,
    @User() user: UserEntity,
  ) {
    const instructor = await this.quizzesService.getInstructor(id);
    if (instructor.id !== user.id) {
      throw new ForbiddenException('You do not have access to this quiz');
    }
    return this.quizzesService.createQuestion(id, createQuestionDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.INSTRUCTOR)
  async getInstructorQuizzes(@User() user: UserEntity) {
    return this.quizzesService.getQuizzesByInstructor(user.id);
  }

  @Get(':id')
  async getQuiz(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.INSTRUCTOR)
  async updateQuiz(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuizDto: UpdateQuizDto,
    @User() user: UserEntity,
  ) {
    const instructor = await this.quizzesService.getInstructor(id);
    if (instructor.id !== user.id) {
      throw new ForbiddenException('You do not have access to this quiz');
    }
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRoleEnum.INSTRUCTOR)
  async deleteQuiz(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ) {
    const instructor = await this.quizzesService.getInstructor(id);
    if (instructor.id !== user.id) {
      throw new ForbiddenException('You do not have access to this quiz');
    }
    return this.quizzesService.remove(id);
  }

  @Get(':id/questions')
  async getQuizQuestions(@Param('id', ParseIntPipe) id: number) {
    return this.quizzesService.getQuestions(id);
  }
}
