import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.services';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { Teacher } from '../../entities/teacher.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';
import { RetrieveNotificationsDto } from '../dtos/retrieve-notifications.dto';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let studentRepo: Repository<Student>;
  let teacherRepo: Repository<Teacher>;
  let teacherStudentRepo: Repository<TeacherStudent>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Teacher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TeacherStudent),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    teacherRepo = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    teacherStudentRepo = module.get<Repository<TeacherStudent>>(getRepositoryToken(TeacherStudent));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockTeacherId = 1;

  it('should return recipients for registered students', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const notification = 'Hello students!';
    
    const mockTeacher = {
      email: teacherEmail,
      id: mockTeacherId,
      teacherStudents: [
        { student: { email: 'student1@example.com', isSuspended: false } },
        { student: { email: 'student2@example.com', isSuspended: false } },
      ],
    } as Teacher;

    jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(mockTeacher);

    const result = await service.getRecipients({ teacher: teacherEmail, notification });

    expect(result).toEqual({ recipients: ['student1@example.com', 'student2@example.com'] });
  });

  it('should return recipients including mentioned students', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const notification = 'Hello students! @student3@example.com';

    const mockTeacher = {
      email: teacherEmail,
      id: mockTeacherId,
      teacherStudents: [
        { student: { email: 'student1@example.com', isSuspended: false } },
      ],
    } as Teacher;

    jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(mockTeacher);
    jest.spyOn(studentRepo, 'find').mockResolvedValue([
      { email: 'student3@example.com', isSuspended: false } as Student,
    ]);

    const result = await service.getRecipients({ teacher: teacherEmail, notification });

    expect(result).toEqual({ recipients: ['student1@example.com', 'student3@example.com'] });
  });

  it('should not include suspended students', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const notification = 'Hey @student2@example.com';

    const mockTeacher = {
      email: teacherEmail,
      id: mockTeacherId,
      teacherStudents: [
        { student: { email: 'student1@example.com', isSuspended: false } },
        { student: { email: 'student2@example.com', isSuspended: true } },
      ],
    } as Teacher;

    jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(mockTeacher);
    jest.spyOn(studentRepo, 'find').mockResolvedValue([
      { email: 'student1@example.com', isSuspended: false } as Student,
    ]);

    const result = await service.getRecipients({ teacher: teacherEmail, notification });

    expect(result).toEqual({ recipients: ['student1@example.com'] });
  });

  it('should return empty recipients if teacher is not found', async () => {
    jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(null);

    const result = await service.getRecipients({
      teacher: 'unknown_teacher@gmail.com',
      notification: 'Hello students!',
    });

    expect(result).toEqual({ recipients: [] });
  });

  it('should throw NotFoundException if mentioned students do not exist', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const notification = 'Hello @nonexistent@example.com';

    const mockTeacher = {
      email: teacherEmail,
      id: mockTeacherId,
      teacherStudents: [],
    } as Teacher;

    jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(mockTeacher);
    jest.spyOn(studentRepo, 'find').mockResolvedValue([]);

    await expect(service.getRecipients({ teacher: teacherEmail, notification })).rejects.toThrow(
      NotFoundException,
    );
  });
});
