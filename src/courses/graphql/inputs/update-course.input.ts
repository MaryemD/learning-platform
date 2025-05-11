import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt } from 'class-validator';
import {CreateCourseInput} from "./create-course.input";

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
    @Field(() => Int)
    id: number;
}