import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { Content } from '../content/content.entity';
import { User } from '../user/user.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  averageRating: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  contactEmail: string;

  @Column()
  dateCreated: Date;

  @Column()
  imageUrl: string;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @ManyToMany(() => User, (user) => user.favoriteCourses)
  favoritedBy: User[];

  @ManyToMany(() => User, (user) => user.enrolledCourses)
  students: User[];

  @OneToMany(() => CourseRate, (rate) => rate.course)
  rates: CourseRate[];
}

@Entity()
export class CourseRate extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.courseRates)
  user: User;

  @ManyToOne(() => Course, (course) => course.rates)
  course: Course;

  @Column()
  rating: number;
}
