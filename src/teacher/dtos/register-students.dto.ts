import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsArray, ArrayNotEmpty } from 'class-validator';

export class RegisterStudentsDto {
  @ApiProperty({ example: 'teacherken@gmail.com', description: 'Email teacher' })
  @IsEmail()
  teacher: string;

  @ApiProperty({
    example: ['studentjon@gmail.com', 'studenthon@gmail.com'],
    description: 'List email students',
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  students: string[];
}
