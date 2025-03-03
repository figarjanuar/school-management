import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { StudentService } from './services/student.service';
import { SuspendStudentDto } from './dtos/suspend-student.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Students')
@Controller('api')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('suspend')
  @HttpCode(204)
  @ApiOperation({ summary: 'Suspend a student' })
  @ApiResponse({ status: 204, description: 'Student suspended successfully' })
  async suspendStudent(@Body() suspendStudentDto: SuspendStudentDto) {
    await this.studentService.suspendStudent(suspendStudentDto.student);
  }
}
