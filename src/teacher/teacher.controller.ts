import { Controller, Post, Body, HttpCode, HttpException, HttpStatus, Get, Query } from '@nestjs/common';
import { TeacherService } from './services/teacher.service';
import { RegisterStudentsDto } from './dtos/register-students.dto';
import { ApiTags, ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CommonStudentsDto } from 'src/teacher/dtos/common-students.dto';

@ApiTags('Teachers')
@Controller('api')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('register')
  @HttpCode(204)
  @ApiResponse({ status: 204, description: 'Students successfully registered' })
  async registerStudents(@Body() registerDto: RegisterStudentsDto) {
    const { teacher, students } = registerDto;

    if (!teacher || !students.length) {
      throw new HttpException({ message: 'Invalid request data' }, HttpStatus.BAD_REQUEST);
    }

    await this.teacherService.registerStudents(teacher, students);
  }

  @Get('commonstudents')
  @ApiQuery({ name: 'teacher', type: [String], required: true, isArray: true })
  @ApiResponse({
    status: 200,
    description: 'List of common students',
    schema: { example: { students: ['student1@gmail.com', 'student2@gmail.com'] } },
  })
  async getCommonStudents(@Query() query: CommonStudentsDto) {
    const students = await this.teacherService.getCommonStudents(query.teacher);
    return { students };
  }
}
