import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsSseController } from './stats.sse.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entities/user.entity';

import { QuizAnswer } from 'src/quizzes/entities/quiz-answer.entity';
import { StatsResolver } from './stats.resolver';
import { QuizQuestion } from 'src/quizzes/entities/quiz-question.entity';
import { Quiz } from 'src/quizzes/entities/quiz.entity';
import { StatsGateway } from './stats.gateway';

@Module({
imports: [TypeOrmModule.forFeature([QuizQuestion, QuizAnswer, UserEntity, Quiz])],
providers: [StatsService, StatsResolver, StatsGateway],
exports: [StatsService],
controllers: [StatsSseController],
})
export class StatsModule {}