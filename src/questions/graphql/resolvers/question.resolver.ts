import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { QuestionsService } from '../../questions.service';
import { Question } from '../../entities/question.entity';
import { CreateQuestionInput } from '../inputs/create-question.input';
import { UpdateQuestionInput } from '../inputs/update-question.input';
import { QuestionModel } from '../models/question.model';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { SessionModel } from '../../../sessions/graphql/models/session.model';
import { SessionsService } from '../../../sessions/sessions.service';

@Resolver(() => QuestionModel)
export class QuestionResolver {
    constructor(
        private readonly questionsService: QuestionsService,
        private readonly sessionsService: SessionsService,
    ) {}

    @Query(() => [QuestionModel])
    async questions(): Promise<Question[]> {
        return this.questionsService.findAll();
    }

    @Query(() => QuestionModel)
    async question(@Args('id', { type: () => Int }) id: number): Promise<Question> {
        return this.questionsService.findOne(id);
    }

    @Query(() => [QuestionModel])
    async questionsBySession(@Args('sessionId', { type: () => Int }) sessionId: number): Promise<Question[]> {
        return this.questionsService.getQuestionsBySession(sessionId);
    }

    @Query(() => [QuestionModel])
    async questionsByUser(@Args('userId', { type: () => Int }) userId: number): Promise<Question[]> {
        return this.questionsService.getQuestionsByUser(userId);
    }

    @Mutation(() => QuestionModel)
    async createQuestion(
        @Args('createQuestionInput') createQuestionInput: CreateQuestionInput
    ): Promise<Question> {
        const createData = {
            content: createQuestionInput.content,
            sessionId: createQuestionInput.sessionId,
            userId: createQuestionInput.userId,
            options: createQuestionInput.options,
            correctAnswerIndex: createQuestionInput.correctAnswerIndex,
            quizId: createQuestionInput.quizId || null 
        };
    
        return this.questionsService.create(createData);
    }

    @Mutation(() => QuestionModel)
    async updateQuestion(
        @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput
    ): Promise<Question> {
        const { id, ...updateData } = updateQuestionInput;
        return this.questionsService.update(id, updateData);
    }

    @Mutation(() => Boolean)
    async removeQuestion(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
        await this.questionsService.remove(id);
        return true;
    }

    @Mutation(() => QuestionModel)
    async markQuestionAsAnswered(@Args('id', { type: () => Int }) id: number): Promise<Question> {
        return this.questionsService.markAsAnswered(id);
    }

    @ResolveField(() => UserModel)
    async user(@Parent() question: Question): Promise<any> {
        return this.questionsService.getUser(question.id);
    }

    @ResolveField(() => SessionModel)
    async session(@Parent() question: Question): Promise<any> {
        return this.questionsService.getSession(question.id);
    }
}