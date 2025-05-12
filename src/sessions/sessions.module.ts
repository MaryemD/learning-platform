import { Module, forwardRef } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionsController } from './sessions.controller';
import { Session } from './entities/session.entity';
import { Course } from '../courses/entities/course.entity';
import { UserEntity } from '../users/entities/user.entity';
import { SessionResolver } from './graphql/resolvers/session.resolver';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Course, UserEntity]),
    forwardRef(() => CoursesModule)
  ],
  providers: [SessionsService, SessionResolver],
  exports: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
