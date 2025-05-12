import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateSessionInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Field()
    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @Field(() => Boolean)
    @IsBoolean()
    isLive: boolean;

    @Field(() => Int)
    @IsInt()
    courseId: number;

    @Field(() => Int)
    @IsInt()
    instructorId: number;
}
