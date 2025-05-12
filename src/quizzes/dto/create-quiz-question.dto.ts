import { IsNotEmpty, IsString, IsNumber, IsArray, Min, Max, ArrayMinSize } from 'class-validator';

export class CreateQuizQuestionDto {
    @IsNotEmpty()
    @IsString()
    questionText: string;

    @IsArray()
    @ArrayMinSize(2)
    @IsString({ each: true })
    options: string[];

    @IsNumber()
    @Min(0)
    @Max(3) 
    correctAnswerIndex: number;

    /* @IsNotEmpty()
    @IsNumber()
    quizId: number; */
}
