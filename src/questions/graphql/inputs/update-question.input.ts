import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

@InputType()
export class UpdateQuestionInput {
    @Field(() => Int)
    @IsInt()
    id: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    content?: string;

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    answered?: boolean;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    sessionId?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    userId?: number;
}