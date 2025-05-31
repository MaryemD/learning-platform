import { IsNumber, IsOptional } from 'class-validator';

export class StartQuizDto {
    @IsNumber()
    quizId: number;

    @IsNumber()
    instructorId: number;

    @IsNumber()
    @IsOptional()
    timeLimit?: number; // in seconds, optional
} 