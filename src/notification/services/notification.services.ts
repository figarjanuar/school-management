import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RetrieveNotificationsDto } from '../dtos/retrieve-notifications.dto';
import { Student } from '../../entities/student.entity';
import { Teacher } from '../../entities/teacher.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Student) private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(TeacherStudent) private readonly teacherStudentRepository: Repository<TeacherStudent>,
  ) {}

  async getRecipients({ teacher, notification }: RetrieveNotificationsDto): Promise<{ recipients: string[] }> {
    const teacherEntity = await this.teacherRepository.findOne({
      where: { email: teacher },
      relations: ['teacherStudents', 'teacherStudents.student'],
    });
  
    if (!teacherEntity) return { recipients: [] };

    const registeredStudents = teacherEntity.teacherStudents
      .map(ts => ts.student)
      .filter(student => !student.isSuspended)
      .map(student => student.email);
    
    const mentionedEmails = (notification.match(/@[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g) || [])
      .map((email: string) => email.substring(1));

    let mentionedStudentEmails: string[] = [];
    
    if (mentionedEmails.length > 0) {
      const mentionedStudents = await this.studentRepository.find({
        where: { email: In(mentionedEmails), isSuspended: false },
      });

      if(mentionedStudents.length === 0) {
        throw new NotFoundException('One or more students not found');
      }

      mentionedStudentEmails = mentionedStudents.map(student => student.email);
    }

    const recipients = mentionedEmails.length > 0
      ? Array.from(new Set([...registeredStudents, ...mentionedStudentEmails]))
      : registeredStudents;
  
    return { recipients };
  }
}
