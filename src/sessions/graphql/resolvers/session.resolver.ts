import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SessionsService } from '../../sessions.service';
import { Session } from '../../entities/session.entity';
import { CreateSessionInput } from '../inputs/create-session.input';
import { UpdateSessionInput } from '../inputs/update-session.input';
import { SessionModel } from '../models/session.model';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { CourseModel } from '../../../courses/graphql/models/course.model';
import { CoursesService } from '../../../courses/courses.service';

@Resolver(() => SessionModel)
export class SessionResolver {
    constructor(
        private readonly sessionsService: SessionsService,
        private readonly coursesService: CoursesService,
    ) {}

    @Query(() => [SessionModel])
    async sessions(): Promise<Session[]> {
        return this.sessionsService.findAll();
    }

    @Query(() => SessionModel)
    async session(@Args('id', { type: () => Int }) id: number): Promise<Session> {
        return this.sessionsService.findOne(id);
    }

    @Mutation(() => SessionModel)
    async createSession(
        @Args('createSessionInput') createSessionInput: CreateSessionInput
    ): Promise<Session> {
        return this.sessionsService.create({
            title: createSessionInput.title,
            startTime: createSessionInput.startTime,
            isLive: createSessionInput.isLive,
            courseId: createSessionInput.courseId,
            instructorId: createSessionInput.instructorId,
        });
    }

    @Mutation(() => SessionModel)
    async updateSession(
        @Args('updateSessionInput') updateSessionInput: UpdateSessionInput
    ): Promise<Session> {
        const { id, ...updateData } = updateSessionInput;
        return this.sessionsService.update(id, updateData);
    }

    @Mutation(() => Boolean)
    async removeSession(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.sessionsService.remove(id);
        return true;
    }

    @Mutation(() => SessionModel)
    async startLiveSession(@Args('id', { type: () => Int }) id: number): Promise<Session> {
        return this.sessionsService.startLiveSession(id);
    }

    @Mutation(() => SessionModel)
    async endLiveSession(@Args('id', { type: () => Int }) id: number): Promise<Session> {
        return this.sessionsService.endLiveSession(id);
    }

    @ResolveField(() => UserModel)
    async instructor(@Parent() session: Session): Promise<any> {
        return this.sessionsService.getInstructor(session.id);
    }

    @ResolveField(() => CourseModel)
    async course(@Parent() session: Session): Promise<any> {
        const sessionWithRelations = await this.sessionsService.findOne(session.id);
        return this.coursesService.findOne(sessionWithRelations.course.id);
    }
}