import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserModel } from '../../../courses/graphql/models/user.model';
import { SessionModel } from '../../../sessions/graphql/models/session.model';
import { QuizQuestionModel } from './quiz-question.model';

@ObjectType()
export class QuizModel {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field(() => SessionModel)
    session: SessionModel;

    @Field(() => [QuizQuestionModel])
    questions: QuizQuestionModel[];

    @Field(() => UserModel)
    instructor: UserModel;
}