import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Welcome: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'tutor' | null>('student');
  const navigate = useNavigate();
  const { setRole } = useApp();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      if (selectedRole === 'student') {
        navigate('/find-tutors');
      } else {
        navigate('/tutor-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background visual orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-12 max-w-2xl w-full text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-black uppercase tracking-wider mb-4">
          <Sparkles className="h-3.5 w-3.5 text-primary-600" />
          Welcome to Tutor Hub 3D
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Personalized Learning, <br />
          <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
            Elevated into 3D.
          </span>
        </h1>
        <p className="text-slate-500 mb-8 text-sm sm:text-base max-w-md mx-auto">
          Choose your account journey to experience interactive 1-on-1 mentorship.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          
          {/* Student Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 relative group text-left ${
              selectedRole === 'student'
                ? 'border-primary-600 bg-primary-50/70 shadow-lg shadow-primary-200 ring-2 ring-primary-300'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {selectedRole === 'student' && (
              <CheckCircle2 className="h-5 w-5 text-primary-600 absolute top-4 right-4" />
            )}
            <div className={`p-4 rounded-2xl mb-3 transition-colors ${
              selectedRole === 'student' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            }`}>
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">I'm a Student</h3>
            <p className="text-xs text-slate-500 text-center">
              Search verified educators, book interactive sessions, and boost grades.
            </p>
          </button>

          {/* Tutor Card */}
          <button
            type="button"
            onClick={() => setSelectedRole('tutor')}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 relative group text-left ${
              selectedRole === 'tutor'
                ? 'border-indigo-600 bg-indigo-50/70 shadow-lg shadow-indigo-200 ring-2 ring-indigo-300'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {selectedRole === 'tutor' && (
              <CheckCircle2 className="h-5 w-5 text-indigo-600 absolute top-4 right-4" />
            )}
            <div className={`p-4 rounded-2xl mb-3 transition-colors ${
              selectedRole === 'tutor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
            }`}>
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">I'm an Educator</h3>
            <p className="text-xs text-slate-500 text-center">
              Manage student schedules, conduct live sessions, and track earnings.
            </p>
          </button>

        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-black text-base bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
        >
          Enter Tutor Hub <ArrowRight className="h-5 w-5" />
        </button>

      </div>
    </div>
  );
};

export default Welcome;
