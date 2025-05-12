import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt } from 'class-validator';

@InputType()
export class CreateCourseInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsString()
    @IsNotEmpty()
    description: string;

    @Field(() => Int)
    @IsInt()
    instructorId: number;
}