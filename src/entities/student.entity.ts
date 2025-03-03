import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeacherStudent } from './teacher-student.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isSuspended: boolean;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  studentTeachers: TeacherStudent[]; // Relasi ke pivot table
}
