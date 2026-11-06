import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';

const Welcome: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor'>('student');
  const navigate = useNavigate();
  const { setRole, login } = useApp();

  const handleAuthRedirect = (mode: 'login' | 'signup') => {
    try { sounds.playClick(); } catch {}
    navigate(`/auth?role=${selectedRole}&mode=${mode}`);
  };

  const handleInstantDemo = async () => {
    try { sounds.playSuccess(); } catch {}
    if (selectedRole === 'student') {
      await login('alex@student.edu', 'demo', 'student');
      navigate('/find-tutors');
    } else {
      await login('rajesh@tutorhub.com', 'demo', 'tutor');
      navigate('/tutor-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* 3D Dynamic Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-600/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-cyan/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Floating 3D Geometric Card Container */}
      <div className="bg-slate-900/85 backdrop-blur-3xl rounded-3xl shadow-2xl border border-slate-800/80 p-6 sm:p-12 max-w-2xl w-full text-center relative z-10">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/30 text-primary-300 text-xs font-black uppercase tracking-wider mb-5">
          <Sparkles className="h-3.5 w-3.5 text-primary-400 animate-pulse" />
          Welcome to Tutor Hub 3D
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
          Personalized Learning, <br />
          <span className="bg-gradient-to-r from-primary-400 via-indigo-300 to-accent-cyan bg-clip-text text-transparent">
            Elevated into 3D.
          </span>
        </h1>
        <p className="text-slate-400 mb-8 text-xs sm:text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Step into Nepal's first 3D live whiteboard classroom. Connect with top 1% educators or inspire learners worldwide.
        </p>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          
          {/* Student Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              try { sounds.playClick(); } catch {}
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 relative group text-left ${
              selectedRole === 'student'
                ? 'border-primary-500 bg-primary-950/40 shadow-xl shadow-primary-500/10 ring-2 ring-primary-500/50 scale-[1.02]'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            {selectedRole === 'student' && (
              <CheckCircle2 className="h-5 w-5 text-primary-400 absolute top-4 right-4 animate-in zoom-in" />
            )}
            <div className={`p-4 rounded-2xl mb-3 transition-colors ${
              selectedRole === 'student' ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
            }`}>
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">I'm a Student</h3>
            <p className="text-xs text-slate-400 text-center">
              Search top mentors, schedule live 3D sessions, and get 24/7 AI homework support.
            </p>
          </button>

          {/* Tutor Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole('tutor');
              try { sounds.playClick(); } catch {}
            }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-300 relative group text-left ${
              selectedRole === 'tutor'
                ? 'border-indigo-500 bg-indigo-950/40 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/50 scale-[1.02]'
                : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            {selectedRole === 'tutor' && (
              <CheckCircle2 className="h-5 w-5 text-indigo-400 absolute top-4 right-4 animate-in zoom-in" />
            )}
            <div className={`p-4 rounded-2xl mb-3 transition-colors ${
              selectedRole === 'tutor' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
            }`}>
              <GraduationCap className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-black text-white mb-1">I'm an Educator</h3>
            <p className="text-xs text-slate-400 text-center">
              Publish hourly rates in NPR, manage live bookings, and teach on our interactive whiteboard.
            </p>
          </button>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={() => handleAuthRedirect('login')}
            className="flex-1 py-4 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Sign In as {selectedRole === 'student' ? 'Student' : 'Educator'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button
            onClick={() => handleAuthRedirect('signup')}
            className="flex-1 py-4 px-6 rounded-2xl font-black text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span>Create New Account</span>
          </button>
        </div>

        {/* Quick Demo & Guest Shortcuts */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-800/80 text-xs text-slate-400">
          <button
            onClick={handleInstantDemo}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
          >
            <Zap className="h-4 w-4 fill-amber-400" />
            <span>1-Click Instant Demo ({selectedRole === 'student' ? 'Alex' : 'Rajesh'})</span>
          </button>

          <Link
            to="/find-tutors"
            className="flex items-center gap-1.5 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Browse Tutors Directly →</span>
          </Link>
        </div>

        {/* Security and Trust Footer */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified Credentials
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary-400" /> Zero Direct Role Spoofing
          </span>
        </div>

      </div>

    </div>
  );
};

export default Welcome;
