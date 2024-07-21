import { ReactNode } from 'react';
import { ChevronRight } from 'react-feather';
import { Link } from 'react-router-dom';

interface SidebarItemProps {
  children: ReactNode;
  to: string;
  active?: boolean;
}

export default function SidebarItem({
  children,
  to,
  active = false,
}: SidebarItemProps) {
  return (
    <Link
      to={to}
      className="no-underline btn rounded-lg py-3 px-2 text-xl transition-colors"
    >
      <span className="flex gap-5 font-light">
        {children} {active ? <ChevronRight /> : null}
      </span>
    </Link>
  );
}
