import { SyntheticEvent } from 'react';
import Course from '../models/course/Course';
import CourseQuery from '../models/course/CourseQuery';
import CreateCourseRequest from '../models/course/CreateCourseRequest';
import GetCoursesResponse from '../models/course/GetCoursesResponse';
import { SendContactRequest } from '../models/course/SendContactRequest';
import UpdateCourseRequest from '../models/course/UpdateCourseRequest';
import apiService from './ApiService';

class UserService {
  async getRate(courseId: string) {
    return await apiService.get(`/api/courses/${courseId}/rate`);
  }

  async rate(courseId: string, value: string) {
    await apiService.post(`/api/courses/${courseId}/rate`, {
      rating: parseInt(value),
    });
  }
  async save(createCourseRequest: CreateCourseRequest): Promise<void> {
    await apiService.post('/api/courses', createCourseRequest);
  }

  async findAll(courseQuery: CourseQuery): Promise<GetCoursesResponse> {
    return (
      await apiService.get<GetCoursesResponse>('/api/courses', {
        params: courseQuery,
      })
    ).data;
  }

  async findOne(id: string): Promise<Course> {
    return (await apiService.get<Course>(`/api/courses/${id}`)).data;
  }

  async update(
    id: string,
    updateCourseRequest: UpdateCourseRequest,
  ): Promise<void> {
    await apiService.put(`/api/courses/${id}`, updateCourseRequest);
  }

  async delete(id: string): Promise<void> {
    await apiService.delete(`/api/courses/${id}`);
  }

  async contact(courseId: string, sendContactRequest: SendContactRequest) {
    await apiService.post(
      `/api/courses/${courseId}/contact`,
      sendContactRequest,
    );
  }

  async changeEnroll(courseId: string) {
    await apiService.post(`/api/courses/${courseId}/enroll`);
  }
}

export default new UserService();
