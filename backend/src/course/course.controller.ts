import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateContentDto, UpdateContentDto } from '../content/content.dto';
import { Content } from '../content/content.entity';
import { ContentQuery } from '../content/content.query';
import { ContentService } from '../content/content.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import {
  CreateCourseDto,
  EmailContentDto,
  GetCoursesResultDto,
  UpdateCourseDto,
} from './course.dto';
import { Course } from './course.entity';
import { CourseQuery } from './course.query';
import { CourseService } from './course.service';
import { MailerService } from 'src/mailer/mailer.service';
import { AuthorizedUser } from 'src/decorators/authorized-user.decorator';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { QueryBuilder } from 'typeorm';

@Controller('courses')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Courses')
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly contentService: ContentService,
    private readonly mailerService: MailerService,
  ) {}

  @Post()
  @Roles(Role.Admin, Role.Editor)
  async save(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return await this.courseService.save(createCourseDto);
  }

  @Get()
  async findAll(
    @Query() courseQuery: CourseQuery,
  ): Promise<GetCoursesResultDto> {
    const courses = await this.courseService.findAll(courseQuery);
    const total = await this.courseService.count(courseQuery);
    return { courses, total };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string): Promise<Course> {
    return await this.courseService.findById(id);
  }

  @Put('/:id')
  @Roles(Role.Admin, Role.Editor)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  async delete(@Param('id') id: string): Promise<string> {
    return await this.courseService.delete(id);
  }

  @Post('/:id/contact/')
  async contactEmail(
    @AuthorizedUser() authorizedUser: User,
    @Param('id') courseId: string,
    @Body() emailContentDto: EmailContentDto,
  ): Promise<void> {
    const { title, message } = emailContentDto;
    const course = await this.courseService.findById(courseId);
    const beforeMessage = `Contact received from: ${authorizedUser.username} in course: ${course.name}\nMessage:\n`;
    await this.mailerService.sendMail(
      course.contactEmail,
      title,
      beforeMessage + message,
    );
  }

  @Post('/:id/enroll')
  async changeEnroll(
    @Param('id') courseId: string,
    @AuthorizedUser() authorizedUser: User,
  ): Promise<void> {
    const user = await this.userService.findById(authorizedUser.id);
    const course = await this.courseService.findById(courseId);
    const isAlreadyEnrolled = course.students.find(
      (student) => student.id == user.id,
    );
    if (isAlreadyEnrolled) {
      this.courseService.unenroll(user, course);
    } else {
      this.courseService.enroll(user, course);
    }
  }

  @Post('/:id/contents')
  @Roles(Role.Admin, Role.Editor)
  async saveContent(
    @Param('id') id: string,
    @Body() createContentDto: CreateContentDto,
  ): Promise<Content> {
    return await this.contentService.save(id, createContentDto);
  }

  @Get('/:id/contents')
  async findAllContentsByCourseId(
    @Param('id') id: string,
    @Query() contentQuery: ContentQuery,
  ): Promise<Content[]> {
    return await this.contentService.findAllByCourseId(id, contentQuery);
  }

  @Put('/:id/contents/:contentId')
  @Roles(Role.Admin, Role.Editor)
  async updateContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    return await this.contentService.update(id, contentId, updateContentDto);
  }

  @Delete('/:id/contents/:contentId')
  @Roles(Role.Admin)
  async deleteContent(
    @Param('id') id: string,
    @Param('contentId') contentId: string,
  ): Promise<string> {
    return await this.contentService.delete(id, contentId);
  }
}
