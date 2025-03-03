import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../../entities/teacher.entity';
import { Student } from '../../entities/student.entity';
import { TeacherStudent } from '../../entities/teacher-student.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(TeacherStudent)
    private readonly teacherStudentRepository: Repository<TeacherStudent>,
  ) {}

  async registerStudents(teacherEmail: string, studentEmails: string[]): Promise<void> {
    let teacher = await this.teacherRepository.findOne({ where: { email: teacherEmail } });
    if (!teacher) {
      teacher = this.teacherRepository.create({ email: teacherEmail });
      await this.teacherRepository.save(teacher);
    }

    const students = await Promise.all(
      studentEmails.map(async (email) => {
        let student = await this.studentRepository.findOne({ where: { email } });
        if (!student) {
          student = this.studentRepository.create({ email });
          await this.studentRepository.save(student);
        }
        return student;
      }),
    );

    const existingRelations = await this.teacherStudentRepository.find({
      where: students.map((student) => ({ teacher: { id: teacher.id }, student: { id: student.id } })),
      relations: ['teacher', 'student'],
    });

    const newRelations = students
      .filter((student) => !existingRelations.some((rel) => rel.student.id === student.id))
      .map((student) => ({ teacher, student }));

    if (newRelations.length > 0) {
      await this.teacherStudentRepository.save(newRelations);
    }
  }

  async getCommonStudents(teacherEmails: string[]): Promise<string[]> {
    const teachers = await this.teacherRepository.find({
      where: teacherEmails.map((email) => ({ email })),
      relations: ['teacherStudents', 'teacherStudents.student'],
    });

    if (teachers.length !== teacherEmails.length) {
      throw new NotFoundException('One or more teachers not found');
    }

    const studentsMap = new Map<string, number>();

    teachers.forEach((teacher) => {
      teacher.teacherStudents.forEach((ts) => {
        const studentEmail = ts.student.email;
        studentsMap.set(studentEmail, (studentsMap.get(studentEmail) || 0) + 1);
      });
    });

    return [...studentsMap.keys()].filter((email) => studentsMap.get(email) === teachers.length);
  }

}
