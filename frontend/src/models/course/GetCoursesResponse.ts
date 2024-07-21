import Course from './Course';

export default interface GetCoursesResponse {
  courses: Course[];
  total: number;
}
