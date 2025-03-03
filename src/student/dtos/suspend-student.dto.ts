import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SuspendStudentDto {
  @ApiProperty({
    description: 'Email of the student to be suspended',
    example: 'student1@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  student: string;
}
