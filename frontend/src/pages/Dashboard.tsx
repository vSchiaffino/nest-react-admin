import { useQuery } from 'react-query';

import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import useAuth from '../hooks/useAuth';
import useCourses from '../hooks/useCourses';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const { courses } = useCourses('', '', {
    page: 1,
    perPage: 3,
    orderBy: 'dateCreated',
    orderDirection: 'DESC',
  });
  const { data, isLoading } = useQuery('stats', statsService.getStats);

  return (
    <Layout title={'Dashboard'}>
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
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
      <div className="card shadow mt-8 p-12">
        <h2 className="font-semibold text-4xl mb-10">
          Check Out Our Latest Courses!
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <Link
              key={course.id}
              className="card shadow p-4 no-underline text-black"
              to={`/courses/${course.id}`}
            >
              {/* TODO: image config */}
              <img
                src="https://via.placeholder.com/150"
                alt={`Course ${course.name}`}
                className="w-full h-32 object-cover mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-600">{course.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
