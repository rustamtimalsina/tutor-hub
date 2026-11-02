import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, Sparkles, User, ShieldCheck, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole } = useApp();

  const toggleSound = () => {
    sounds.enabled = !sounds.enabled;
    setSoundEnabled(sounds.enabled);
    if (sounds.enabled) {
      sounds.playPop();
    }
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-primary-600 font-bold bg-primary-50/80 px-3.5 py-1.5 rounded-xl border border-primary-100'
      : 'text-slate-600 hover:text-primary-600 font-semibold px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors';

  const homeLink = role === 'tutor' ? '/tutor-dashboard' : '/find-tutors';

  const handleLogout = () => {
    setRole(null);
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to={homeLink} className="flex-shrink-0 flex items-center gap-2.5 group">
                <div className="bg-gradient-to-tr from-primary-600 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-primary-200 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                    Tutor<span className="text-primary-600">Hub</span>
                    <span className="bg-primary-100 text-primary-700 text-[9px] uppercase px-1.5 py-0.5 rounded font-black">3D</span>
                  </span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-2">
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
                  Tutor Dashboard
                </Link>
              )}

              <Link to="/documentation" className={isActive('/documentation')}>
                Documentation
              </Link>
            </div>

            {/* Desktop Auth / Profile controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Sound Effects Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                  soundEnabled
                    ? 'bg-primary-50 border-primary-200 text-primary-700'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4 text-primary-600" /> : <VolumeX className="h-4 w-4" />}
              </button>

              {role ? (
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 pl-3 rounded-2xl">
                  <span className="text-xs font-bold text-slate-700 capitalize flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    {role} Mode
                  </span>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl border border-slate-200 transition-colors shadow-sm"
                    title="Switch role / Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-slate-600 hover:text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-primary-200 transition-all hover:scale-105"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-5 space-y-2 shadow-lg">
            <Link
              to="/find-tutors"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Find Tutors
            </Link>
            {role === 'student' && (
              <Link
                to="/student-dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Student Dashboard
              </Link>
            )}
            {role === 'tutor' && (
              <Link
                to="/tutor-dashboard"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Tutor Dashboard
              </Link>
            )}
            <Link
              to="/documentation"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Documentation
            </Link>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={toggleSound}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-between"
              >
                <span>Sound Effects</span>
                <span className="flex items-center gap-1.5 text-primary-600 font-bold">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </span>
              </button>

              {role ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold"
                >
                  Logout ({role})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Modern Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="text-center mb-6">
              <div className="h-12 w-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Welcome to Tutor Hub</h3>
              <p className="text-xs text-slate-500 mt-1">Select your account role to continue</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => {
                  setRole('student');
                  setShowAuthModal(false);
                  navigate('/student-dashboard');
                }}
                className="p-4 rounded-2xl border-2 border-primary-200 hover:border-primary-600 bg-primary-50/50 text-center transition-all group"
              >
                <span className="block font-black text-slate-900 text-sm group-hover:text-primary-700">Student</span>
                <span className="text-[11px] text-slate-500">Book & learn</span>
              </button>
              <button
                onClick={() => {
                  setRole('tutor');
                  setShowAuthModal(false);
                  navigate('/tutor-dashboard');
                }}
                className="p-4 rounded-2xl border-2 border-indigo-200 hover:border-indigo-600 bg-indigo-50/50 text-center transition-all group"
              >
                <span className="block font-black text-slate-900 text-sm group-hover:text-indigo-700">Tutor</span>
                <span className="text-[11px] text-slate-500">Teach & earn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
