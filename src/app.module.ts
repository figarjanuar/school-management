import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher.entity';
import { Student } from 'src/entities/student.entity';
import { TeacherStudent } from 'src/entities/teacher-student.entity';
import { TeacherController } from 'src/teacher/teacher.controller';
import { TeacherService } from 'src/teacher/services/teacher.service';
import { StudentController } from 'src/student/student.controller';
import { StudentService } from 'src/student/services/student.service';
import { NotificationController } from 'src/notification/notification.controller';
import { NotificationService } from 'src/notification/services/notification.services';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'school',
      autoLoadEntities: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Teacher, Student, TeacherStudent]),
  ],
  controllers: [TeacherController, StudentController, NotificationController],
  providers: [TeacherService, StudentService, NotificationService],
})
export class AppModule {}
