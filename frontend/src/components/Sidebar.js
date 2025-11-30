import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { useAddTargetModal } from '../context/AddTargetModalContext';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobileNavOpen, toggleMobileNav }) => {
  const [modesOpen, setModesOpen] = useState(false);
  const [payloadsOpen, setPayloadsOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { openModal } = useAddTargetModal();

  // Close submenus when sidebar collapses
  useEffect(() => {
    if (isCollapsed) {
      setModesOpen(false);
      setPayloadsOpen(false);
    }
  }, [isCollapsed]);

  const isActive = (path) => location.pathname === path;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-20
    flex flex-col 
    w-60 bg-surface-light shadow-lg 
    transform transition-all duration-300 ease-in-out
    ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 
    ${isCollapsed ? 'md:w-16' : 'md:w-60'}
  `;

  const handleLinkClick = () => {
    if (isMobileNavOpen) {
      toggleMobileNav();
    }
  };

  return (
    <aside id="sidebar" className={sidebarClasses}>
      <div className={`p-4 flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-between'} h-18 border-b border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center">
          <img id="sidebar-logo" src="/images/Logo.png" alt="CyberLynx Logo" className="h-10 w-10 object-contain rounded-lg" />
          <h1 id="sidebar-title" className={`text-2xl font-bold text-primary ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>CyberLynX</h1>
        </div>
        <button onClick={toggleMobileNav} className="md:hidden text-text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <nav className="mt-6 flex-grow">
        <div className={`px-4 mb-4 ${isCollapsed ? 'md:px-2' : ''}`}>
          <button 
            onClick={() => {
              openModal();
              handleLinkClick();
            }} 
            className={`w-full flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-center'} py-2 ${isCollapsed ? 'md:px-2' : 'px-4'} bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-200`}
            title={isCollapsed ? 'Add Target' : ''}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Add Target</span>
          </button>
        </div>
        <ul className="space-y-2">
          <li>
            <Link to="/" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Dashboard" title={isCollapsed ? 'Dashboard' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/workflow" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/workflow') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Workflow" title={isCollapsed ? 'Workflow' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m7 0V5a2 2 0 012-2h2a2 2 0 012 2v6m-6 0V5a2 2 0 00-2-2H7a2 2 0 00-2 2v6"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Workflow</span>
            </Link>
          </li>
          <li>
            <Link to="/terminal" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/terminal') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Terminal" title={isCollapsed ? 'Terminal' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Terminal</span>
            </Link>
          </li>
          <li>
            <a href="#" onClick={() => setModesOpen(!modesOpen)} className={`flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Modes" title={isCollapsed ? 'Modes' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.007 12.007 0 002.944 12c.047 2.061.582 4.015 1.381 5.813a11.955 11.955 0 013.04 8.618M12 21a9 9 0 100-18 9 9 0 000 18z"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Modes</span>
              <svg className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${modesOpen ? 'rotate-90' : ''} ${isCollapsed ? 'md:hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
            <ul className={`ml-8 mt-1 space-y-1 ${modesOpen && !isCollapsed ? '' : 'hidden'} ${isCollapsed ? 'md:hidden' : ''}`}>
              <li><Link to="/recon" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">Recon</Link></li>
              <li><Link to="/persistence" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">Persistence</Link></li>
              <li><Link to="/exploit" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">Exploit</Link></li>
            </ul>
          </li>
          <li>
            <a href="#" onClick={() => setPayloadsOpen(!payloadsOpen)} className={`flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Payloads" title={isCollapsed ? 'Payloads' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Payloads</span>
              <svg className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${payloadsOpen ? 'rotate-90' : ''} ${isCollapsed ? 'md:hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
            <ul className={`ml-8 mt-1 space-y-1 ${payloadsOpen && !isCollapsed ? '' : 'hidden'} ${isCollapsed ? 'md:hidden' : ''}`}>
              <li><Link to="/payloads/all" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">All Payloads</Link></li>
              <li><Link to="/payloads/xss" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">XSS</Link></li>
              <li><Link to="/payloads/sqli" onClick={handleLinkClick} className="flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200">SQLi</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/reports" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/reports') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Reports" title={isCollapsed ? 'Reports' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Reports</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/profile') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Profile" title={isCollapsed ? 'Profile' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Profile</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" onClick={handleLinkClick} className={`flex items-center py-2 px-4 ${isActive('/settings') ? 'text-white bg-primary rounded' : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'} transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Settings" title={isCollapsed ? 'Settings' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Settings</span>
            </Link>
          </li>
          <li>
            <a href="#" onClick={handleLinkClick} className={`flex items-center py-2 px-4 text-text-secondary hover:bg-gray-200 hover:text-text-primary transition-colors duration-200 ${isCollapsed ? 'md:justify-center' : ''}`} data-tooltip="Logout" title={isCollapsed ? 'Logout' : ''}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              <span className={`ml-3 ${isCollapsed ? 'md:hidden' : ''}`}>Logout</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'md:p-2' : ''}`}>
        <button onClick={toggleDarkMode} className={`w-full mb-2 py-2 ${isCollapsed ? 'md:px-2' : 'px-4'} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-text-primary flex items-center ${isCollapsed ? 'md:justify-center' : 'justify-center'} transition-colors duration-200`} title={isCollapsed ? (darkMode ? 'Light Mode' : 'Dark Mode') : ''}>
          {darkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
          <span className={`ml-2 ${isCollapsed ? 'md:hidden' : ''}`}>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={toggleSidebar} id="sidebar-toggle" className={`w-full mt-2 py-2 ${isCollapsed ? 'md:px-2' : 'px-4'} bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-text-primary hidden md:flex items-center ${isCollapsed ? 'justify-center' : 'justify-center'} transition-colors duration-200`} title={isCollapsed ? 'Expand' : 'Collapse'}>
          <svg id="sidebar-icon" className={`w-5 h-5 transform ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
          <span className={`ml-2 ${isCollapsed ? 'md:hidden' : ''}`}>{isCollapsed ? 'Expand' : 'Collapse'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

