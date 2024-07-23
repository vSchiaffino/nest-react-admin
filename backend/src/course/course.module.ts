import { forwardRef, Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MailerService } from '../mailer/mailer.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [forwardRef(() => ContentModule)],
  controllers: [CourseController],
  providers: [CourseService, MailerService, UserService],
  exports: [CourseService],
})
export class CourseModule {}
