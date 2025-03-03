import { ApiProperty } from '@nestjs/swagger';

export class RetrieveNotificationsResponseDto {
  @ApiProperty({
    description: 'List of students who will receive the notification',
    example: ['student1@gmail.com', 'student2@gmail.com'],
  })
  recipients: string[];
}
