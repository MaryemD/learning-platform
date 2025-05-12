import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsInt()
    instructorId: number;
}
