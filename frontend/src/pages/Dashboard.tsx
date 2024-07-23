import { useQuery } from 'react-query';

import UpdateProfile from '../components/profile/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import { Link } from 'react-router-dom';
import Course from '../models/course/Course';
import useFavoriteCourses from '../hooks/useFavoriteCourses';
import UserService from '../services/UserService';

function FeaturedCourses({
  title,
  courses,
}: {
  title: string;
  courses: Course[];
}) {
  return (
    <div className="card shadow mt-8 p-12">
      <h2 className="font-semibold text-4xl mb-10">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses &&
          courses.map((course) => (
            <Link
              key={course.id}
              className="card shadow p-4 no-underline text-black"
              to={`/courses/${course.id}`}
            >
              <img
                src={course.imageUrl}
                alt={`Course ${course.name}`}
                className="w-full h-32 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-600">{course.description}</p>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery(`user-${authenticatedUser.id}`, () =>
    UserService.findOne(authenticatedUser.id),
  );
  const { courses, isLoading: isLoadingCourses } = useCourses('', '', {
    page: 1,
    perPage: 3,
    orderBy: 'dateCreated',
    orderDirection: 'DESC',
  });
  const { data, isLoading: isLoadingStats } = useQuery(
    'stats',
    statsService.getStats,
  );
  const { favoriteCourses, isLoading: isLoadingFavoriteCourses } =
    useFavoriteCourses();

  return (
    <Layout title={'Dashboard'}>
      <div className="mt-5 flex flex-col gap-5">
        {!isLoadingStats ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {authenticatedUser.role === 'admin' && (
              <div className="card shadow text-white bg-[#0074d9] flex-1">
                <h1 className="font-semibold sm:text-4xl text-center mb-3">
                  {data.numberOfUsers}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Users</p>
              </div>
            )}

            <div className="card shadow text-white bg-[#4a4aff] flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfCourses}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Courses</p>
            </div>
            <div className="card shadow text-white bg-[#2d6a4f] flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfContents}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Contents</p>
            </div>
          </div>
        ) : null}
      </div>
      {!isLoadingCourses && (
        <FeaturedCourses
          courses={courses}
          title="Check Out Our Latest Courses!"
        />
      )}
      {!isLoading && (
        <>
          <FeaturedCourses
            courses={user.favoriteCourses}
            title="Your favorite courses:"
          />
          <FeaturedCourses
            courses={user.enrolledCourses}
            title="Your enrolled courses:"
          />
        </>
      )}
    </Layout>
  );
}
