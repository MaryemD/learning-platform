import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { Session } from '../sessions/entities/session.entity';
import { UserEntity } from '../users/entities/user.entity';
import { QuestionsController } from './questions.controller';
import { QuestionResolver } from './graphql/resolvers/question.resolver';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Session, UserEntity]),
  SessionsModule,
],
  controllers: [QuestionsController],
  providers: [QuestionsService,
    QuestionResolver,
  ],
  exports: [QuestionsService],
})
export class QuestionsModule {}
