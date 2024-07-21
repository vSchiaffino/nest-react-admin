import { BookOpen, Home, LogOut, Users } from 'react-feather';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import UrbanaLogoWhite from '../../assets/urbano-logo-white.png';

import useAuth from '../../hooks/useAuth';
import authService from '../../services/AuthService';
import SidebarItem from './SidebarItem';

interface SidebarProps {
  className: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const history = useHistory();

  const { authenticatedUser, setAuthenticatedUser } = useAuth();

  const handleLogout = async () => {
    await authService.logout();
    setAuthenticatedUser(null);
    history.push('/login');
  };

  return (
    <div className={'sidebar bg-cover' + className}>
      <Link to="/" className="no-underline mb-20">
        <img src={UrbanaLogoWhite} className="w-full" />
      </Link>
      <nav className="mt-5 flex flex-col gap-8 flex-grow">
        <SidebarItem to="/">
          <Home size={30} strokeWidth={1} /> Dashboard
        </SidebarItem>
        <SidebarItem to="/courses">
          <BookOpen size={30} strokeWidth={1} /> Courses
        </SidebarItem>
        {authenticatedUser.role === 'admin' ? (
          <SidebarItem to="/users">
            <Users size={30} strokeWidth={1} /> Users
          </SidebarItem>
        ) : null}
      </nav>
      <button
        className="text-primary-red border-primary-red border rounded-md p-3 transition-colors flex gap-3 justify-center items-center font-semibold focus:outline-none text-lg"
        onClick={handleLogout}
      >
        <LogOut /> Logout
      </button>
    </div>
  );
}
