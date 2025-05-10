import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { SessionsModule } from './sessions/sessions.module';
import { QuestionsModule } from './questions/questions.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { RealtimeModule } from './realtime/realtime.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PermissionsModule } from './permissions/permissions.module';
import { SharedModule } from './shared/shared.module';
import { UserEntity } from './users/entities/user.entity';
import { Course } from './courses/entities/course.entity';
import { Session } from './sessions/entities/session.entity';
import { Question } from './questions/entities/question.entity';
import { Quiz } from './quizzes/entities/quiz.entity';
import { QuizQuestion } from './quizzes/entities/quiz-question.entity';
import { QuizAnswer } from './quizzes/entities/quiz-answer.entity';
import {RealtimecGateway} from "./realtimec/realtimec.gateway";
import {ConfigModule} from "@nestjs/config";

declare const process: any;

import * as dotenv from 'dotenv';
dotenv.config();


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      entities: [UserEntity, Course, Session, Question, Quiz, QuizQuestion, QuizAnswer],
      synchronize: true,
    }),
    SharedModule,
    AuthModule,
    UserModule,
    CoursesModule,
    SessionsModule,
    QuestionsModule,
    QuizzesModule,
    RealtimeModule,
    AnalyticsModule,
    PermissionsModule
  ],
  controllers: [AppController],
  providers: [AppService, RealtimecGateway],
})
export class AppModule {}
