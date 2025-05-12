import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { QuizzesService } from '../../quizzes.service';
import { Quiz } from '../../entities/quiz.entity';
import { CreateQuizInput } from '../inputs/create-quiz.input';
import { QuizModel } from '../models/quiz.model';
import { QuizQuestionModel } from '../models/quiz-question.model';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { SessionModel } from '../../../sessions/graphql/models/session.model';
import { CreateQuizQuestionInput } from '../inputs/create-quiz-question.input';
import { QuizQuestion } from 'src/quizzes/entities/quiz-question.entity';

@Resolver(() => QuizModel)
export class QuizResolver {
    constructor(private readonly quizzesService: QuizzesService) {}

    @Query(() => [QuizModel])
    async quizzes(): Promise<Quiz[]> {
        return this.quizzesService.findAll();
    }

    @Query(() => QuizModel)
    async quiz(@Args('id', { type: () => Int }) id: number): Promise<Quiz> {
        return this.quizzesService.findOne(id);
    }

    @Mutation(() => QuizModel)
    async createQuiz(
        @Args('createQuizInput') createQuizInput: CreateQuizInput
    ): Promise<Quiz> {
        return this.quizzesService.create(createQuizInput);
    }

    @ResolveField(() => SessionModel)
    async session(@Parent() quiz: Quiz): Promise<any> {
        return this.quizzesService.getSession(quiz.id);
    }

    @ResolveField(() => [QuizQuestionModel])
    async questions(@Parent() quiz: Quiz): Promise<any> {
        return this.quizzesService.getQuestions(quiz.id);
    }

    @ResolveField(() => UserModel)
    async instructor(@Parent() quiz: Quiz): Promise<any> {
        return this.quizzesService.getInstructor(quiz.id);
    }
    
    @Mutation(() => QuizQuestionModel)
async createQuizQuestion(
    @Args('quizId', { type: () => Int }) quizId: number,
    @Args('createQuizQuestionInput') input: CreateQuizQuestionInput
): Promise<QuizQuestion> {
    return this.quizzesService.createQuestion(quizId, input);
}

@Mutation(() => QuizModel)
async addQuestionsToQuiz(
    @Args('quizId', { type: () => Int }) quizId: number,
    @Args('questionIds', { type: () => [Int] }) questionIds: number[]
): Promise<Quiz> {
    return this.quizzesService.addQuestionsToQuiz(quizId, questionIds);
}
} 
