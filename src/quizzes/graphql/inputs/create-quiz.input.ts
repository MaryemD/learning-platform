import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsOptional, IsArray } from 'class-validator';
import { CreateQuizQuestionInput } from './create-quiz-question.input';

@InputType()
export class CreateQuizInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field(() => Int)
    @IsInt()
    sessionId: number;

    @Field(() => [CreateQuizQuestionInput], { nullable: true })
    @IsOptional()
    @IsArray()
    questions?: CreateQuizQuestionInput[];
} 