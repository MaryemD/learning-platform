import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    sessionId: number;

    @IsInt()
    userId: number;
}