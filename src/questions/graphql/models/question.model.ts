import { ObjectType, Field, Int } from '@nestjs/graphql';
import { SessionModel } from 'src/sessions/graphql/models/session.model';
import { UserModel } from 'src/courses/graphql/models/user.model';
import { QuizModel } from 'src/quizzes/graphql/models/quiz.model';


@ObjectType('QuestionModel')
export class QuestionModel {
    @Field(() => Int)
    id: number;

    @Field()
    content: string;

    @Field(() => Boolean)
    answered: boolean;

    @Field(() => [String])
    options: string[];

    @Field(() => Int)
    correctAnswerIndex: number;

    @Field(() => [Int], { nullable: true })
    userAnswers?: number[];

    @Field(() => SessionModel)
    session: SessionModel;

    @Field(() => UserModel)
    user: UserModel;

    @Field(() => QuizModel, { nullable: true })
    quiz?: QuizModel;
}