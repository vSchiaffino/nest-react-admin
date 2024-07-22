import { forwardRef, Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [forwardRef(() => ContentModule)],
  controllers: [CourseController],
  providers: [CourseService, MailerService],
  exports: [CourseService],
})
export class CourseModule {}
