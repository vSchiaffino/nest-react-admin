import { useState } from 'react';
import { Menu, X } from 'react-feather';

import Sidebar from './Sidebar';

export default function Layout({ title, children }) {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <>
      <Sidebar className={showSidebar ? 'show' : ''} />
      <hr />
      <div className="lg:ml-72 mx-auto">
        <div className="bg-brand-header-background px-12 py-8">
          <h1 className="font-medium text-xlg ">{title}</h1>
        </div>
        <div className="px-12 mt-8">{children}</div>
      </div>
      <button
        className={`fixed bottom-5 border shadow-md bg-white p-3 rounded-full transition-all focus:outline-none lg:hidden ${
          showSidebar ? 'right-5' : 'left-5'
        }`}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        {showSidebar ? <X size={30} /> : <Menu size={30} />}
      </button>
    </>
  );
}
