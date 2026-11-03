import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap,
  Globe,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const initialRole = searchParams.get('role') === 'tutor' ? 'tutor' : 'student';

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'student' | 'tutor'>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gradeLevel, setGradeLevel] = useState('High School (Grade 11-12)');
  const [hourlyRate, setHourlyRate] = useState(1500);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [bio, setBio] = useState('');

  const navigate = useNavigate();
  const { login, register } = useApp();

  const handleSubjectToggle = (subj: string) => {
    try { sounds.playClick(); } catch {}
    setSelectedSubjects(prev => 
      prev.includes(subj) ? prev.filter(s => s !== subj) : [...prev, subj]
    );
  };

  const fillDemoAccount = (demoRole: 'student' | 'tutor') => {
    try { sounds.playClick(); } catch {}
    setRole(demoRole);
    setMode('login');
    if (demoRole === 'student') {
      setEmail('alex@student.edu');
      setPassword('studentPass123!');
    } else {
      setEmail('rajesh@tutorhub.com');
      setPassword('tutorSecret999!');
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error('Please enter both email and password.');
        }
        await login(email.trim(), password, role);
      } else {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error('Please enter a valid email address.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }

        await register({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          gradeLevel: role === 'student' ? gradeLevel : undefined,
          hourlyRate: role === 'tutor' ? Number(hourlyRate) : undefined,
          subjects: role === 'tutor' ? selectedSubjects : undefined,
          bio: role === 'tutor' ? (bio.trim() || 'Passionate educator on Tutor Hub 3D.') : undefined,
        });
      }

      // Route to destination
      if (role === 'student') {
        navigate('/find-tutors');
      } else {
        navigate('/tutor-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      try { sounds.playCancel(); } catch {}
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* 3D Atmosphere Glowing Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Tutor<span className="text-primary-400">Hub</span> <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-300 font-bold border border-primary-500/30">3D</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create Your 3D Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access live interactive 1-on-1 classrooms & verified educators
          </p>
        </div>

        {/* Quick Demo One-Click Fill */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Instant Demo Access:</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => fillDemoAccount('student')}
              className="flex-1 sm:flex-none text-xs font-bold px-3 py-1.5 rounded-xl bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Student (Alex)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('tutor')}
              className="flex-1 sm:flex-none text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Tutor (Rajesh)
            </button>
          </div>
        </div>

        {/* Card Frame */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          
          {/* Top Tabs: Login vs Register */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                try { sounds.playClick(); } catch {}
              }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                try { sounds.playClick(); } catch {}
              }}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setRole('student');
                  try { sounds.playClick(); } catch {}
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                  role === 'student'
                    ? 'border-primary-500 bg-primary-500/10 text-white ring-1 ring-primary-500'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'student' ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Student</div>
                  <div className="text-[10px] text-slate-400">Learn & Book</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole('tutor');
                  try { sounds.playClick(); } catch {}
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${
                  role === 'tutor'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className={`p-2 rounded-xl ${role === 'tutor' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Tutor / Mentor</div>
                  <div className="text-[10px] text-slate-400">Teach & Earn</div>
                </div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name (Signup only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. Alex Johnson' : 'e.g. Dr. Rajesh Sharma'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Demo password reset: You can sign in with any email, or use the 1-Click Demo buttons above!')}
                    className="text-[11px] text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Student Specific Fields (Signup) */}
            {mode === 'signup' && role === 'student' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Academic Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 transition-colors"
                >
                  <option>Middle School (Grade 6-8)</option>
                  <option>High School (Grade 9-10)</option>
                  <option>High School (+2 / Grade 11-12)</option>
                  <option>University / Undergraduate</option>
                  <option>Professional / Adult Learner</option>
                </select>
              </div>
            )}

            {/* Tutor Specific Fields (Signup) */}
            {mode === 'signup' && role === 'tutor' && (
              <div className="space-y-3 pt-1 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Subjects You Teach (Click to toggle)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Mathematics', 'Physics', 'Science', 'Computer Science', 'English', 'Chemistry'].map(subj => {
                      const active = selectedSubjects.includes(subj);
                      return (
                        <button
                          key={subj}
                          type="button"
                          onClick={() => handleSubjectToggle(subj)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            active
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {subj} {active && '✓'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Coins className="h-3.5 w-3.5 text-amber-400" /> Hourly Rate (NPR)
                    </label>
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 text-cyan-400" /> Teaching Region
                    </label>
                    <input
                      type="text"
                      defaultValue="Kathmandu & Online"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Short Bio & Teaching Philosophy
                  </label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Briefly describe your experience and teaching methodology..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 rounded-xl font-black text-sm bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-xl shadow-primary-600/30 hover:shadow-primary-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? `Sign In as ${role === 'student' ? 'Student' : 'Tutor'}` : `Complete ${role === 'student' ? 'Student' : 'Tutor'} Registration`}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Badges */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 256-bit SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary-400" /> Instant 1-on-1 Access
            </span>
          </div>

        </div>

        {/* Footer Guest Link */}
        <div className="text-center mt-6">
          <Link
            to="/find-tutors"
            className="text-xs text-slate-400 hover:text-white transition-colors underline decoration-slate-600 underline-offset-4"
          >
            Or browse verified tutors as guest →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Auth;
