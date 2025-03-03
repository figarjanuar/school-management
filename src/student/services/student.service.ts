import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async suspendStudent(email: string): Promise<void> {
    const student = await this.studentRepository.findOne({ where: { email } });

    if (!student) {
      throw new NotFoundException({ message: 'Student not found' });
    }

    student.isSuspended = true;
    await this.studentRepository.save(student);
  }
}
