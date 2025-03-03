import { StudentService } from './student.service';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';
import { NotFoundException } from '@nestjs/common';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentRepo: Repository<Student>;

  beforeEach(() => {
    studentRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    } as unknown as Repository<Student>;

    studentService = new StudentService(studentRepo);
  });

  it('should suspend a student if found', async () => {
    const mockStudent = { email: 'test@student.com', isSuspended: false } as Student;

    jest.spyOn(studentRepo, 'findOne').mockResolvedValue(mockStudent);
    jest.spyOn(studentRepo, 'save').mockResolvedValue(mockStudent);

    await studentService.suspendStudent('test@student.com');

    expect(studentRepo.findOne).toHaveBeenCalledWith({ where: { email: 'test@student.com' } });
    expect(mockStudent.isSuspended).toBe(true);
    expect(studentRepo.save).toHaveBeenCalledWith(mockStudent);
  });

  it('should throw NotFoundException if student does not exist', async () => {
    jest.spyOn(studentRepo, 'findOne').mockResolvedValue(null);

    await expect(studentService.suspendStudent('notfound@student.com')).rejects.toThrow(NotFoundException);
  });
});
