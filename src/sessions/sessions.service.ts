import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Course } from '../courses/entities/course.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
    @InjectRepository(Course)
    private readonly coursesRepo: Repository<Course>,
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async create(createDto: CreateSessionDto): Promise<Session> {
    const course = await this.coursesRepo.findOneBy({ id: createDto.courseId });
    if (!course) throw new NotFoundException('Course not found');

    const instructor = await this.usersRepo.findOneBy({
      id: createDto.instructorId,
    });
    if (!instructor) throw new NotFoundException('Instructor not found');

    const session = this.sessionsRepo.create({
      title: createDto.title,
      startTime: createDto.startTime,
      isLive: createDto.isLive,
      course,
      instructor,
    });
    return this.sessionsRepo.save(session);
  }

  findAll(): Promise<Session[]> {
    return this.sessionsRepo.find();
  }

  async findOne(id: number): Promise<Session> {
    const session = await this.sessionsRepo.findOne({
      where: { id },
      relations: ['course', 'instructor', 'messages', 'quizzes'],
    });
    if (!session) throw new NotFoundException(`Session #${id} not found`);
    return session;
  }

  async update(id: number, updateDto: UpdateSessionDto): Promise<Session> {
    const session = await this.findOne(id);

    if (updateDto.courseId !== undefined) {
      const course = await this.coursesRepo.findOneBy({
        id: updateDto.courseId,
      });
      if (!course) throw new NotFoundException('Course not found');
      session.course = course;
    }

    if (updateDto.instructorId !== undefined) {
      const instructor = await this.usersRepo.findOneBy({
        id: updateDto.instructorId,
      });
      if (!instructor) throw new NotFoundException('Instructor not found');
      session.instructor = instructor;
    }

    // Filter out courseId and instructorId since they are not columns
    const { courseId, instructorId, ...restDto } = updateDto;
    Object.assign(session, restDto);

    return this.sessionsRepo.save(session);
  }

  async remove(id: number): Promise<void> {
    const session = await this.findOne(id);
    await this.sessionsRepo.remove(session);
  }

  async getSessionsByCourse(courseId: number): Promise<Session[]> {
    return this.sessionsRepo.find({
      where: {
        course: { id: courseId },
      },
      relations: ['instructor'],
    });
  }

  async getInstructor(sessionId: number): Promise<UserEntity> {
    const session = await this.sessionsRepo.findOne({
      where: { id: sessionId },
      relations: ['instructor'],
    });

    if (!session)
      throw new NotFoundException(`Session #${sessionId} not found`);
    return session.instructor;
  }

  async startLiveSession(id: number): Promise<Session> {
    const session = await this.findOne(id);
    session.isLive = true;
    return this.sessionsRepo.save(session);
  }

  async endLiveSession(id: number): Promise<Session> {
    const session = await this.findOne(id);
    session.isLive = false;
    return this.sessionsRepo.save(session);
  }
}
