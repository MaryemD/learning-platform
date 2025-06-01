import { IsNumber } from 'class-validator';

export class SubmitAnswerDto {
    @IsNumber()
    quizId: number;

    @IsNumber()
    questionId: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    selectedOptionIndex: number;
} 