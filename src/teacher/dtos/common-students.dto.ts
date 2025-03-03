import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, ArrayMinSize } from 'class-validator';

export class CommonStudentsDto {
  @ApiProperty({
    description: 'List of teacher emails',
    example: ['teacher1@gmail.com', 'teacher2@gmail.com'],
    isArray: true,
  })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  teacher: string[];
}
