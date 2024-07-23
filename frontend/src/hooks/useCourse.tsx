import { useQuery } from 'react-query';
import CourseService from '../services/CourseService';

export const useCourse = (id: string) => {
  const { data, isLoading, refetch } = useQuery(
    ['course', id],
    async () => await CourseService.findOne(id),
  );
  return { course: data, isLoading, refetch };
};
