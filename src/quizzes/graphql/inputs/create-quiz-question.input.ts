import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsArray, Min, Max, ArrayMinSize } from 'class-validator';

@InputType()
export class CreateQuizQuestionInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    questionText: string;

    @Field(() => [String])
    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options: string[];

    @Field(() => Int)
    @Min(0)
    @Max(3)
    correctAnswerIndex: number;
} 