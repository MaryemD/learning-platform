import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { QuizModel } from './quiz.model';
import { UserModel } from '../../../courses/graphql/models/user.model';

@ObjectType()
export class QuizAnswerModel {
    @Field(() => ID)
    id: number;

    @Field(() => Int)
    questionId: number;

    @Field(() => Int)
    selectedOptionIndex: number;

    @Field(() => QuizModel)
    quiz: QuizModel;

    @Field(() => UserModel)
    user: UserModel;
}