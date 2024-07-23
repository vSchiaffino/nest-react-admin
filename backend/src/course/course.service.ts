import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course, CourseRate } from './course.entity';
import { CourseQuery } from './course.query';
import { User } from '../user/user.entity';

@Injectable()
export class CourseService {
  async getRate(courseId: string, userId: string): Promise<CourseRate | null> {
    return await CourseRate.findOne({
      where: { course: { id: courseId }, user: { id: userId } },
    });
  }
  async rate(courseId: string, userId: string, rating: number) {
    const existingRate = await CourseRate.findOne({
      where: { course: { id: courseId }, user: { id: userId } },
    });
    if (existingRate) {
      existingRate.rating = rating;
      existingRate.save();
    } else {
      await CourseRate.create({
        rating,
        course: { id: courseId },
        user: { id: userId },
      }).save();
    }
  }

  private processFilter(filter: { name?: string; description?: string }) {
    Object.keys(filter).forEach((key) => {
      filter[key] = ILike(`%${filter[key]}%`);
    });
    return filter;
  }

  async enroll(user: User, course: Course) {
    course.students.push(user);
    await course.save();
  }

  async unenroll(user: User, course: Course) {
    course.students = course.students.filter(
      (eachUser) => eachUser.id !== user.id,
    );

    await course.save();
  }

  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    const { page, perPage, orderBy, orderDirection, ...filter } = courseQuery;
    const where = this.processFilter(filter);
    const take = perPage || 10;
    const skip = ((page || 1) - 1) * take;
    return await Course.find({
      relations: ['rates'],
      where,
      take,
      skip,
      order: {
        [orderBy || 'name']: orderDirection || 'ASC',
      },
    });
  }

  async findById(id: string, loadRelations = false): Promise<Course> {
    const course = await Course.findOne(id, {
      relations: loadRelations ? ['students'] : [],
    });

    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(courseQuery: CourseQuery = {}): Promise<number> {
    const { page, perPage, orderBy, orderDirection, ...filter } = courseQuery;
    const where = this.processFilter(filter);
    return await Course.count({
      where,
    });
  }
}
