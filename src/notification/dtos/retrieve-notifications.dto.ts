import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RetrieveNotificationsDto {
  @ApiProperty({
    description: 'Email of the teacher sending the notification',
    example: 'teacher1@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  teacher: string;

  @ApiProperty({
    description: 'Notification message (can contain mentions)',
    example: 'Hello students! @student1@gmail.com @student2@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  notification: string;
}
