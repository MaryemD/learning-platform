import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateQuizAnswerDto {
    @IsNotEmpty()
    @IsNumber()
    quizId: number;

    @IsNotEmpty()
    @IsNumber()
    questionId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsNumber()
    @Min(0)
    @Max(3) // Assuming max 4 options (0-3)
    selectedOptionIndex: number;
}
