import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateQuizDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    sessionId?: number;
}
