import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

import { Role } from '../enums/role.enum';
import { Course, CourseRate } from '../course/course.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Course, (course) => course.favoritedBy, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  favoriteCourses: Course[];

  @ManyToMany(() => Course, (course) => course.students, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinTable()
  enrolledCourses: Course[];

  @OneToMany(() => CourseRate, (courseRate) => courseRate.user, {
    cascade: true,
  })
  courseRates: CourseRate[];
}
