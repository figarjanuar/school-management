import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.teacher)
  teacherStudents: TeacherStudent[]; // Relasi ke pivot table
}
