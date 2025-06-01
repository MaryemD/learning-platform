import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { QuizzesService } from './quizzes.service';
import { QuizResolver } from './graphql/resolvers/quiz.resolver';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';
import { QuizzesGateway } from './quizzes.gateway';
import { QuizzesController } from './quizzes.controller';
import { AnalyticsModule } from 'src/analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      QuizQuestion,
      QuizAnswer,
      Session,
      UserEntity,
    ]),
    AnalyticsModule,
  ],
  providers: [QuizzesService, QuizResolver, QuizzesGateway],
  controllers: [QuizzesController],
  exports: [QuizzesService],
})
export class QuizzesModule {}
