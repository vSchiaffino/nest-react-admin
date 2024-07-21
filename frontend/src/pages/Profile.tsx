import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';

export function Profile() {
  return (
    <Layout title={'My profile'}>
      <UpdateProfile />
    </Layout>
  );
}
