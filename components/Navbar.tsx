import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [role, setRole] = useState<string | null>(localStorage.getItem('tutorHubRole'));

  // Update role state if it changes in localStorage (e.g. after login/welcome screen)
  useEffect(() => {
    setRole(localStorage.getItem('tutorHubRole'));
  }, [location]);

  const isActive = (path: string) => location.pathname === path ? 'text-primary-600 font-semibold' : 'text-gray-600 hover:text-primary-600';

  const homeLink = role === 'tutor' ? '/tutor-dashboard' : '/find-tutors';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={homeLink} className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary-600 p-1.5 rounded-lg">
                 <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Tutor Hub</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to={homeLink} className={isActive(homeLink)}>Home</Link>
            
            {role !== 'tutor' && (
              <Link to="/find-tutors" className={isActive('/find-tutors')}>Find Tutors</Link>
            )}
            
            {role === 'student' && (
              <Link to="/student-dashboard" className={isActive('/student-dashboard')}>Dashboard</Link>
            )}

            {role === 'tutor' && (
               <Link to="/tutor-dashboard" className={isActive('/tutor-dashboard')}>Dashboard</Link>
            )}

            <Link to="/documentation" className={isActive('/documentation')}>Documentation</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             {role ? (
               <div className="flex items-center gap-4">
                 <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full capitalize">{role}</span>
                 <Link to="/" onClick={() => localStorage.removeItem('tutorHubRole')} className="text-gray-500 hover:text-red-600" title="Logout">
                   <LogOut className="h-5 w-5" />
                 </Link>
               </div>
             ) : (
               <>
                <button className="text-gray-600 hover:text-primary-600 font-medium px-3 py-2">
                  Login
                </button>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-md shadow-primary-200">
                  Sign Up
                </button>
               </>
             )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to={homeLink} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Home</Link>
            
            {role !== 'tutor' && (
              <Link to="/find-tutors" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Find Tutors</Link>
            )}
            
            {role === 'student' && (
               <Link to="/student-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Dashboard</Link>
            )}
             
            {role === 'tutor' && (
               <Link to="/tutor-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Dashboard</Link>
            )}

            <Link to="/documentation" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Documentation</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
             {role ? (
               <div className="flex flex-col px-5 space-y-2">
                 <button onClick={() => { localStorage.removeItem('tutorHubRole'); window.location.href = '#/'; }} className="w-full text-center py-2 border border-red-200 text-red-600 rounded-lg font-medium">Logout</button>
               </div>
             ) : (
                <div className="flex items-center px-5 space-y-2 flex-col">
                  <button className="w-full text-center py-2 text-gray-600 font-medium">Login</button>
                  <button className="w-full text-center py-2 bg-primary-600 text-white rounded-lg font-medium">Sign Up</button>
                </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;