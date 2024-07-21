import { useQuery } from 'react-query';

import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';
import statsService from '../services/StatsService';
import useAuth from '../hooks/useAuth';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
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

        <UpdateProfile />
      </div>
    </Layout>
  );
}
