import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private readonly coursesRepo: Repository<Course>,
        @InjectRepository(UserEntity)
        private readonly usersRepo: Repository<UserEntity>,
    ) {}

    async create(createDto: CreateCourseDto): Promise<Course> {
        const instructor = await this.usersRepo.findOneBy({ id: createDto.instructorId });
        if (!instructor) throw new NotFoundException('Instructor not found');

        const course = this.coursesRepo.create({
            title: createDto.title,
            description: createDto.description,
            instructor,
        });
        return this.coursesRepo.save(course);
    }

    findAll(): Promise<Course[]> {
        return this.coursesRepo.find();
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepo.findOne({
            where: { id },
            relations: ['instructor', 'sessions'], // Load related data
        });
        if (!course) throw new NotFoundException(`Course #${id} not found`);
        return course;
    }

    async update(id: number, updateDto: Partial<{ description: any; title: any; instructorId: any }>): Promise<Course> {
        const course = await this.findOne(id);

        if (updateDto.instructorId !== undefined) {
            const instructor = await this.usersRepo.findOneBy({ id: updateDto.instructorId });
            if (!instructor) throw new NotFoundException('Instructor not found');
            course.instructor = instructor;
        }

        const { instructorId, ...restDto } = updateDto;
        Object.assign(course, restDto);

        return this.coursesRepo.save(course);
    }

    async remove(id: number): Promise<void> {
        const course = await this.findOne(id);
        await this.coursesRepo.remove(course);
    }

    async getInstructor(courseId: number): Promise<UserEntity> {
        const course = await this.coursesRepo.findOne({
            where: { id: courseId },
            relations: ['instructor'],
        });

        if (!course) throw new NotFoundException(`Course #${courseId} not found`);
        return course.instructor;
    }
}