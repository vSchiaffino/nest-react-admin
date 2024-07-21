import { useQuery } from 'react-query';
import CourseService from '../services/CourseService';

export default function useCourses(name: string, description: string) {
  const { data, isLoading, refetch } = useQuery(
    ['courses', name, description],
    () =>
      CourseService.findAll({
        name: name || undefined,
        description: description || undefined,
      }),
  );
  return {
    courses: data,
    isLoading,
    refetch,
  };
}
