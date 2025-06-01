import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';


@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly service: CoursesService) {}

    @Post()
    create(@Body() dto: CreateCourseDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }
    // ✅ Add the guard


    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.service.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCourseDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.service.remove(id);
    }
}
