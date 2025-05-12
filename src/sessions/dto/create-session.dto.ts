import { IsString, IsNotEmpty, IsInt, IsDate, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessionDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDate()
    @Type(() => Date)
    startTime: Date;

    @IsBoolean()
    isLive: boolean;

    @IsInt()
    courseId: number;

    @IsInt()
    instructorId: number;
}