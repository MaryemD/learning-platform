import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class QuizQuestionModel {
    @Field(() => Int)
    id: number;

    @Field()
    questionText: string;

    @Field(() => [String])
    options: string[];

    @Field(() => Int)
    correctAnswerIndex: number;
}