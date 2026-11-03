import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  BookOpen, 
  LogOut, 
  Sparkles, 
  User as UserIcon, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Bell, 
  Moon, 
  Sun, 
  ChevronDown, 
  GraduationCap, 
  Clock, 
  Check, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { 
    currentUser, 
    role, 
    setRole, 
    logout, 
    notifications, 
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    darkMode,
    toggleDarkMode
  } = useApp();

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundEnabled(sounds.enabled);
    if (sounds.enabled) {
      try { sounds.playPop(); } catch {}
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-primary-600 dark:text-primary-400 font-bold bg-primary-50 dark:bg-primary-950/40 px-3.5 py-1.5 rounded-xl border border-primary-100 dark:border-primary-900/50'
      : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors';

  const homeLink = role === 'tutor' ? '/tutor-dashboard' : '/find-tutors';

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
    navigate('/auth?mode=login');
  };

  const handleRoleSwitch = (newRole: 'student' | 'tutor') => {
    try { sounds.playClick(); } catch {}
    setRole(newRole);
    setShowProfileMenu(false);
    if (newRole === 'student') {
      navigate('/find-tutors');
    } else {
      navigate('/tutor-dashboard');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to={homeLink} className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  Tutor<span className="text-primary-600 dark:text-primary-400">Hub</span>
                  <span className="bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-[10px] uppercase px-1.5 py-0.5 rounded font-black border border-primary-200 dark:border-primary-800">
                    3D
                  </span>
                </span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/find-tutors" className={isActive('/find-tutors')}>
              Find Tutors
            </Link>
            
            {role === 'student' && (
              <Link to="/student-dashboard" className={isActive('/student-dashboard')}>
                Student Dashboard
              </Link>
            )}

            {role === 'tutor' && (
              <Link to="/tutor-dashboard" className={isActive('/tutor-dashboard')}>
                Educator Dashboard
              </Link>
            )}

            <Link to="/documentation" className={isActive('/documentation')}>
              Documentation
            </Link>
          </div>

          {/* Desktop Right Controls (Theme, Sound, Notifications, User) */}
          <div className="hidden md:flex items-center space-x-2.5">
            
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                soundEnabled
                  ? 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
                  : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-primary-600 dark:text-primary-400" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  setShowProfileMenu(false);
                  try { sounds.playClick(); } catch {}
                }}
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all shadow-sm"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={clearNotifications}
                        className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) {
                              setShowNotifMenu(false);
                              navigate(n.link);
                            }
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative ${
                            n.read
                              ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/80 text-slate-500'
                              : 'bg-primary-50/40 dark:bg-primary-950/20 border-primary-200 dark:border-primary-900/60 text-slate-800 dark:text-slate-200 shadow-sm'
                          }`}
                        >
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary-600 absolute top-3 right-3" />
                          )}
                          <div className="text-xs font-black text-slate-900 dark:text-white mb-0.5 pr-4">
                            {n.title}
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug mb-1.5">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {n.time}
                            </span>
                            {n.link && (
                              <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-bold">
                                View <ExternalLink className="h-2.5 w-2.5" />
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown or Login Button */}
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifMenu(false);
                    try { sounds.playClick(); } catch {}
                  }}
                  className="flex items-center gap-2 p-1.5 pl-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-primary-400 transition-all shadow-sm group"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-600"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-400 capitalize flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${currentUser.role === 'tutor' ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform" />
                </button>

                {/* Profile Drawer */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <div className="font-black text-slate-900 dark:text-white text-xs">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300">
                        {currentUser.role} account
                      </span>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate(currentUser.role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <UserIcon className="h-3.5 w-3.5 text-primary-600" />
                        My Dashboard
                      </button>

                      {/* Switch Role Quick Toggle */}
                      <button
                        onClick={() => handleRoleSwitch(currentUser.role === 'student' ? 'tutor' : 'student')}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5 text-indigo-500" />
                          Switch to {currentUser.role === 'student' ? 'Educator' : 'Student'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">⇄</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors flex items-center gap-2"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md shadow-primary-500/20 transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

          </div>

          {/* Mobile Menu & Quick Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2.5 shadow-2xl animate-in slide-in-from-top duration-150">
          
          {currentUser && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500"
                />
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                  <span className="text-[9px] font-bold text-primary-600 dark:text-primary-400 uppercase">
                    {currentUser.role} mode
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  handleRoleSwitch(currentUser.role === 'student' ? 'tutor' : 'student');
                  setIsOpen(false);
                }}
                className="px-2.5 py-1 text-[11px] font-bold bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg"
              >
                Switch Role
              </button>
            </div>
          )}

          <Link
            to="/find-tutors"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Find Tutors
          </Link>

          {role === 'student' && (
            <Link
              to="/student-dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Student Dashboard
            </Link>
          )}

          {role === 'tutor' && (
            <Link
              to="/tutor-dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Educator Dashboard
            </Link>
          )}

          <Link
            to="/documentation"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Documentation
          </Link>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={toggleSound}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center justify-between"
            >
              <span>Sound Effects</span>
              <span className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-bold">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                {soundEnabled ? 'Enabled' : 'Muted'}
              </span>
            </button>

            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/auth?mode=login"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth?mode=signup"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 text-center bg-primary-600 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
