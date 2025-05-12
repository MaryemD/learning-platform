import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsArray, IsOptional, ArrayMinSize, Min, Max } from 'class-validator';

@InputType()
export class CreateQuestionInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    content: string;

    @Field(() => Int)
    @IsInt()
    sessionId: number;

    @Field(() => Int)
    @IsInt()
    userId: number;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options?: string[];

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @Min(0)
    @Max(3)
    correctAnswerIndex?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    quizId?: number;
}