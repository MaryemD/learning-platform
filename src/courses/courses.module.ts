import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseResolver } from './graphql/resolvers/course.resolver';
import { UserEntity } from '../users/entities/user.entity';
import {SessionsModule} from "../sessions/sessions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, UserEntity, SessionsModule]),
    SessionsModule,
  ],
  providers: [CoursesService, CourseResolver],
  controllers: [CoursesController],
  exports: [CoursesService],
})
export class CoursesModule {}
