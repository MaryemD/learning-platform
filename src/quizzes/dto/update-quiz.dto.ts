import { IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizQuestionDto } from './create-quiz-question.dto';

export class UpdateQuizDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    sessionId?: number;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuizQuestionDto)
    questions?: CreateQuizQuestionDto[];
}
