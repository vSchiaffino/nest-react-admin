import { useQuery } from 'react-query';
import UserService from '../services/UserService';

export default function useFavoriteCourses() {
  const { data, isLoading, refetch } = useQuery(['favoriteCourses'], () =>
    UserService.getFavoriteCourses(),
  );
  const changeFavoriteCourse = async (courseId: string) => {
    await UserService.favoriteCourse(courseId);
    refetch();
  };
  const favoriteCourses = data?.data;
  return { isLoading, favoriteCourses, changeFavoriteCourse };
}
