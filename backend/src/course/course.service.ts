import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindConditions, ILike } from 'typeorm';

import { CreateCourseDto, UpdateCourseDto } from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';

@Injectable()
export class CourseService {
  private processFilter(filter: { name?: string; description?: string }) {
    Object.keys(filter).forEach((key) => {
      filter[key] = ILike(`%${filter[key]}%`);
    });
    return filter;
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
      where,
      take,
      skip,
      order: {
        [orderBy || 'name']: orderDirection || 'ASC',
      },
    });
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
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
