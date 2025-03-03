import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Student } from './student.entity';

@Entity('teacher_students') // Nama tabel pivot
export class TeacherStudent {
  @PrimaryGeneratedColumn()
  id: number; // ID unik buat setiap relasi

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherStudents, { onDelete: 'CASCADE' })
  teacher: Teacher;

  @ManyToOne(() => Student, (student) => student.studentTeachers, { onDelete: 'CASCADE' })
  student: Student;
}
