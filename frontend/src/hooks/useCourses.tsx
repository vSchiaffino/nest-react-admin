import { useQuery } from 'react-query';
import CourseService from '../services/CourseService';
import Course from '../models/course/Course';
import Pagination from '../models/shared/pagination';

export default function useCourses(
  name: string,
  description: string,
  pagination: Pagination,
) {
  const { page, perPage, orderBy, orderDirection } = pagination;
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description, pagination],
    () =>
      CourseService.findAll({
        name: name || undefined,
        description: description || undefined,
        page,
        perPage,
        orderBy,
        orderDirection,
      }),
  );
  const { total, courses } = data || {};
  return {
    courses,
    total,
    isLoading,
    refetch,
  };
}
