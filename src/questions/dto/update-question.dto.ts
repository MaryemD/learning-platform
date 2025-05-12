import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateQuestionDto {
    @IsString()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    answered?: boolean;

    @IsInt()
    @IsOptional()
    sessionId?: number;

    @IsInt()
    @IsOptional()
    userId?: number;
}