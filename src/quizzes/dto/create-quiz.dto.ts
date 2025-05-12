import { IsNotEmpty, IsString, IsNumber, ValidateNested, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';

export class CreateQuizDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    sessionId: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizQuestionDto)
    questions?: CreateQuizQuestionDto[];
}
