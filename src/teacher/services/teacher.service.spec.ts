import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';
import { NotFoundException } from '@nestjs/common';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepo: Repository<Teacher>;
  let studentRepo: Repository<Student>;
  let teacherStudentRepo: Repository<TeacherStudent>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Student),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TeacherStudent),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepo = module.get<Repository<Teacher>>(getRepositoryToken(Teacher));
    studentRepo = module.get<Repository<Student>>(getRepositoryToken(Student));
    teacherStudentRepo = module.get<Repository<TeacherStudent>>(getRepositoryToken(TeacherStudent));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudents', () => {
    it('should register students to a teacher', async () => {
      const teacherEmail = 'teacher@example.com';
      const studentEmails = ['student1@example.com', 'student2@example.com'];

      const mockTeacher = { id: 1, email: teacherEmail };
      const mockStudents = studentEmails.map((email, index) => ({ id: index + 1, email }));

      jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(mockTeacher as Teacher);
      jest.spyOn(studentRepo, 'findOne').mockImplementation(async ({ where }) => {
        if (Array.isArray(where)) return null;

        const student = mockStudents.find((s) => s.email === where!.email);
        return student ? (student as Student) : null;
      });

      jest.spyOn(studentRepo, 'save').mockImplementation(async (student) => student as Student);
      jest.spyOn(teacherStudentRepo, 'find').mockResolvedValue([]);
      jest.spyOn(teacherStudentRepo, 'save').mockImplementation(async (data) => data as TeacherStudent);

      await service.registerStudents(teacherEmail, studentEmails);

      expect(teacherRepo.findOne).toHaveBeenCalledWith({ where: { email: teacherEmail } });
      expect(studentRepo.findOne).toHaveBeenCalledTimes(studentEmails.length);
      expect(studentRepo.save).toHaveBeenCalledTimes(0); // Semua students sudah ada
      expect(teacherStudentRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should create a new teacher if not exists', async () => {
      const teacherEmail = 'teacher@example.com';
      const studentEmails = ['student1@example.com'];

      const mockTeacher = { id: 1, email: teacherEmail };
      const mockStudent = { id: 1, email: 'student1@example.com' };

      jest.spyOn(teacherRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(teacherRepo, 'create').mockReturnValue(mockTeacher as Teacher);
      jest.spyOn(teacherRepo, 'save').mockResolvedValue(mockTeacher as Teacher);
      jest.spyOn(studentRepo, 'findOne').mockImplementation(async ({ where }) => {
        const student = (where as { email: string })?.email === mockStudent.email ? mockStudent : null;
        return student ? (student as Student) : null;
      });
      jest.spyOn(teacherStudentRepo, 'find').mockResolvedValue([]);
      jest.spyOn(teacherStudentRepo, 'save').mockImplementation(async (data) => data as TeacherStudent);

      await service.registerStudents(teacherEmail, studentEmails);

      expect(teacherRepo.create).toHaveBeenCalledWith({ email: teacherEmail });
      expect(teacherRepo.save).toHaveBeenCalledWith(mockTeacher);
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students for given teachers', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];

      const teacher1 = {
        id: 1,
        email: 'teacher1@example.com',
        teacherStudents: [{ student: { email: 'student1@example.com' } }],
      } as Teacher;

      const teacher2 = {
        id: 2,
        email: 'teacher2@example.com',
        teacherStudents: [{ student: { email: 'student1@example.com' } }],
      } as Teacher;

      jest.spyOn(teacherRepo, 'find').mockResolvedValue([teacher1, teacher2]);

      const result = await service.getCommonStudents(teacherEmails);

      expect(result).toEqual(['student1@example.com']);
    });

    it('should throw NotFoundException if any teacher is not found', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];

      jest.spyOn(teacherRepo, 'find').mockResolvedValue([{ email: 'teacher1@example.com' } as Teacher]);

      await expect(service.getCommonStudents(teacherEmails)).rejects.toThrow(NotFoundException);
    });
  });
});
