import UpdateProfile from '../components/profile/UpdateProfile';
import Layout from '../components/layout';

export function Profile() {
  return (
    <Layout title={'My profile'}>
      <UpdateProfile />
    </Layout>
  );
}
