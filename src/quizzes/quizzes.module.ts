import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { QuizQuestion } from './entities/quiz-question.entity';
import { QuizAnswer } from './entities/quiz-answer.entity';
import { QuizzesService } from './quizzes.service';
import { QuizResolver } from './graphql/resolvers/quiz.resolver';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      QuizQuestion,
      QuizAnswer,
      Session,
      UserEntity
    ])
  ],
  providers: [QuizzesService, QuizResolver],
  exports: [QuizzesService]
})
export class QuizzesModule {}