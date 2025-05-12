import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CoursesService } from '../../courses.service';
import { Course } from '../../entities/course.entity';
import { SessionsService } from '../../../sessions/sessions.service';
import {CourseModel} from "../models/course.model";
import {CreateCourseInput} from "../inputs/create-course.input";
import {UpdateCourseInput} from "../inputs/update-course.input";
import {UserModel} from "../models/user.model";
import { SessionModel } from 'src/sessions/graphql/models/session.model';
@Resolver(() => CourseModel)
export class CourseResolver {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Query(() => [CourseModel])
    async courses(): Promise<Course[]> {
        return this.coursesService.findAll();
    }

    @Query(() => CourseModel)
    async course(@Args('id', { type: () => Int }) id: number): Promise<Course> {
        return this.coursesService.findOne(id);
    }

    @Mutation(() => CourseModel)
    async createCourse(
        @Args('createCourseInput') createCourseInput: CreateCourseInput
    ): Promise<Course> {
        return this.coursesService.create({
            title: createCourseInput.title,
            description: createCourseInput.description,
            instructorId: createCourseInput.instructorId,
        });
    }

    @Mutation(() => CourseModel)
    async updateCourse(
        @Args('updateCourseInput') updateCourseInput: UpdateCourseInput
    ): Promise<Course> {
        return this.coursesService.update(updateCourseInput.id, {
            title: updateCourseInput.title,
            description: updateCourseInput.description,
            instructorId: updateCourseInput.instructorId,
        });
    }

    @Mutation(() => Boolean)
    async removeCourse(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.coursesService.remove(id);
        return true;
    }

    @ResolveField(() => UserModel)
    async instructor(@Parent() course: Course) {
        return this.coursesService.getInstructor(course.id);
    }

    @ResolveField(() => [SessionModel])
    async sessions(@Parent() course: Course) {
        return this.sessionsService.getSessionsByCourse(course.id);
    }
}