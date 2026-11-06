import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, SlidersHorizontal, ArrowRight, 
  Heart, Sparkles, Filter, CheckCircle2, Award, Zap,
  Eye, Calendar, ShieldCheck, Cpu, Layers, MessageSquare, ChevronRight
} from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants';
import Hero3DCanvas from '../components/Hero3DCanvas';
import TiltCard from '../components/TiltCard';
import Spotlight from '../components/Spotlight';
import BackgroundGrid from '../components/BackgroundGrid';
import Marquee from '../components/Marquee';
import LiveMetricsBar from '../components/LiveMetricsBar';
import TutorPreviewModal from '../components/TutorPreviewModal';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';
import { Tutor } from '../types';
import { sounds } from '../utils/soundEffects';

const QUICK_TAGS = ['Physics 11/12', 'Calculus', 'Python', 'SEE Math', 'Organic Chemistry', 'IELTS'];

const INSTITUTIONS = [
  { name: 'IOE Pulchowk', tag: 'Engineering', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Tribhuvan University', tag: 'Central Campus', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Kathmandu University', tag: 'KU Dhulikhel', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { name: "St. Xavier's Maitighar", tag: '+2 Science', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { name: 'Budhanilkantha School', tag: 'A-Levels', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'The British College', tag: 'Computing', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { name: 'Apex College', tag: 'Management', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [selectedLevel, setSelectedLevel] = useState('All levels');
  const [minRating, setMinRating] = useState(0);

  // Modals
  const [previewTutor, setPreviewTutor] = useState<Tutor | null>(null);
  const [bookingTutor, setBookingTutor] = useState<Tutor | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Press '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Multi-filter logic
  const filteredTutors = useMemo(() => {
    return tutors.filter((tutor) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tutor.name.toLowerCase().includes(query) ||
        tutor.bio.toLowerCase().includes(query) ||
        tutor.subjects.some((s) => s.toLowerCase().includes(query));

      const matchesSubject =
        selectedSubject === 'All subjects' ||
        tutor.subjects.some((s) => s.toLowerCase() === selectedSubject.toLowerCase());

      const matchesLevel =
        selectedLevel === 'All levels' ||
        (tutor.gradeLevels && tutor.gradeLevels.includes(selectedLevel));

      const matchesPrice = tutor.price <= priceRange;
      const matchesRating = tutor.rating >= minRating;

      return matchesSearch && matchesSubject && matchesLevel && matchesPrice && matchesRating;
    });
  }, [tutors, searchTerm, selectedSubject, selectedLevel, priceRange, minRating]);

  const handleClearFilters = () => {
    try { sounds.playClick(); } catch {}
    setSelectedSubject('All subjects');
    setSelectedLevel('All levels');
    setPriceRange(5000);
    setMinRating(0);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 21st.dev Next-Gen Hero Section with Aceternity Spotlight & Background Grid */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Aceternity Spotlight Beam */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="#8b5cf6" />
        
        {/* Glowing Background Dot Grid Matrix */}
        <BackgroundGrid type="dots" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-primary-200 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Nepal's Premier 3D Interactive Mentorship</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              Master Any Subject with <br />
              <span className="bg-gradient-to-r from-primary-400 via-sky-300 to-purple-300 bg-clip-text text-transparent">
                World-Class Mentors
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience personalized 1-on-1 learning with verified tutors in Nepal. Real-time collaborative 3D whiteboard, instant AI STEM copilot, and 100% escrow payment protection.
            </p>

            {/* Interactive Search Bar with Keyboard Shortcut */}
            <div className="max-w-xl mx-auto lg:mx-0 relative pt-1">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
                <div className="pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 px-3 py-2.5 sm:py-3 text-xs sm:text-base font-medium"
                  placeholder="Search subject, tutor, or college (e.g. Calculus, Alex)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="hidden sm:flex items-center mr-2 px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-[11px] text-slate-300 font-mono">
                  /
                </div>
                <button 
                  onClick={() => {
                    try { sounds.playClick(); } catch {}
                    const el = document.getElementById('tutors-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 mt-3">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Popular:</span>
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      try { sounds.playClick(); } catch {}
                      setSearchTerm(tag);
                      const el = document.getElementById('tutors-catalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Verified Credentials</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cyan-400" />
                <span>Escrow Milestone Security</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Khalti & eSewa Checkout</span>
              </div>
            </div>

          </div>

          {/* Right 3D Interactive Canvas Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <div className="w-full max-w-[340px] sm:max-w-[420px] lg:max-w-none">
              <Hero3DCanvas />
            </div>
          </div>

        </div>

      </section>

      {/* 21st.dev Live Metrics Bar */}
      <LiveMetricsBar />

      {/* 21st.dev Infinite Marquee of Verified Institutions & Tutors */}
      <div className="py-4 border-y border-slate-200/60 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Educators From Top Institutions
          </span>
          <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Verified Network
          </span>
        </div>
        <Marquee speed={40}>
          {INSTITUTIONS.map((inst, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-sm whitespace-nowrap cursor-default ${inst.color}`}
            >
              <span>{inst.name}</span>
              <span className="text-[10px] opacity-75 font-mono px-1.5 py-0.2 rounded-full bg-black/20">
                {inst.tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* 21st.dev Bento Grid Feature Showcase */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-bold mb-2">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" /> Next-Gen Learning Stack
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed for Nepali Learners & Mentors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Everything you need for an immersive online classroom experience that outshines traditional tuition centers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: 3D Classroom Whiteboard */}
          <div className="md:col-span-2 relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950 text-white border border-indigo-500/30 shadow-xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-primary-500/30 transition-all" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-primary-300 mb-4">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                  Multiplayer Bézier Whiteboard
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed font-normal">
                  Draw math formulas, physics free-body diagrams, and organic chemistry structures in real-time with quadratic curve smoothing and zero lag over WebSockets.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                  ⚡ 60 FPS Sync
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                  ✏️ Bézier Smoothing
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold border border-white/15">
                  📷 PNG Export
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AI STEM Copilot */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                Built-In AI STEM Copilot
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Stuck on a calculus integral, quadratic roots, or kinematics problem? Get instant hints and formula derivations live during your class.
              </p>
            </div>
            <div className="mt-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs font-mono text-primary-600 dark:text-primary-300">
              f'(x) = 3x² + 4x + 7
            </div>
          </div>

          {/* Card 3: Escrow Payment Milestone */}
          <div className="relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                100% Escrow Protection
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Your tuition fees remain safely locked in escrow until the lesson is completed. If you're not satisfied, request an instant dispute refund.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Zero Upfront Risk
            </div>
          </div>

          {/* Card 4: Local Nepal Payments */}
          <div className="md:col-span-2 relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 text-white border border-purple-500/20 shadow-xl flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                  Instant Khalti & eSewa Booking
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed font-normal">
                  No international cards needed. Pay in Nepalese Rupees directly via mobile wallets with instant sandbox verification.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="px-4 py-2 rounded-2xl bg-purple-600/30 border border-purple-400/40 font-black text-xs text-purple-200">
                  Khalti Pay
                </div>
                <div className="px-4 py-2 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 font-black text-xs text-emerald-200">
                  eSewa
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Subjects Pill Grid */}
      <section className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-colors">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">Explore by Subject</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Click any subject to filter available educators instantly</p>
            </div>
            <button
              onClick={() => setSelectedSubject('All subjects')}
              className={`text-xs font-bold transition-colors ${
                selectedSubject === 'All subjects'
                  ? 'text-primary-600 dark:text-primary-400 underline font-black'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Show All Subjects
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {POPULAR_SUBJECTS.map((subject) => {
              const isSelected = selectedSubject === subject.name;
              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    try { sounds.playClick(); } catch {}
                    setSelectedSubject(subject.name);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50/70 dark:bg-primary-950/40 ring-2 ring-primary-500/20 shadow-md scale-105'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-2xl mb-2">{subject.icon}</div>
                  <div className="font-black text-slate-900 dark:text-white text-xs sm:text-sm leading-tight">
                    {subject.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {subject.tutorCount} Tutors
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section with Sidebar Filters & Next-Level Tutor Cards */}
      <section id="tutors-catalog" className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 sticky top-24 space-y-6">
              
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary-600 dark:text-primary-400" /> Filters
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline"
                >
                  Reset all
                </button>
              </div>

              {/* Subject Dropdown */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All subjects">All subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                </select>
              </div>

              {/* Grade Level Dropdown */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">Grade Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="All levels">All levels</option>
                  <option value="SEE / Grade 10">SEE / Grade 10</option>
                  <option value="+2 Science">+2 Science</option>
                  <option value="+2 Management">+2 Management</option>
                  <option value="A-Levels">A-Levels</option>
                  <option value="Undergraduate">Undergraduate</option>
                </select>
              </div>

              {/* Max Hourly Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Max Hourly Rate</label>
                  <span className="text-xs font-black text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-950/50 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-900/50">
                    NPR {priceRange}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                  <span>NPR 500</span>
                  <span>NPR 5,000/hr</span>
                </div>
              </div>

              {/* Rating Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Minimum Rating</label>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/50 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" /> {minRating > 0 ? `${minRating.toFixed(1)}+` : 'Any'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                  <span>Any</span>
                  <span>5.0 ⭐</span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>Verified tutors available for instant 2026 classroom booking.</span>
              </div>

            </div>
          </aside>

          {/* Tutor Listings Grid */}
          <div className="flex-1">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Available Educators</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Showing {filteredTutors.length} verified mentor{filteredTutors.length === 1 ? '' : 's'} across Nepal
                </p>
              </div>
            </div>

            {filteredTutors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No mentors found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
                  No educators matched your exact criteria. Try resetting your filters or adjusting your price and rating ranges.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredTutors.map((tutor) => {
                  const saved = isTutorSaved(tutor.id);

                  return (
                    <TiltCard key={tutor.id} className="w-full">
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-2xl transition-all flex flex-col md:flex-row gap-6 relative">
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            try { sounds.playPop(); } catch {}
                            toggleSaveTutor(tutor.id);
                          }}
                          className={`absolute top-5 right-5 p-2 rounded-full border transition-all z-20 ${
                            saved
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-500 scale-110'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50/50'
                          }`}
                          title={saved ? 'Remove from saved' : 'Save tutor'}
                        >
                          <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                        </button>

                        {/* Avatar & Online Pulse */}
                        <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="relative">
                            <img
                              src={tutor.avatar}
                              alt={tutor.name}
                              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md ring-2 ring-slate-100 dark:ring-slate-700"
                            />
                            <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                              {tutor.availability}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="text-xs font-black text-slate-900 dark:text-white">{tutor.rating}</span>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400">({tutor.reviewCount})</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-grow space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start pr-8">
                            <div>
                              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                                {tutor.name}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {tutor.experience}
                                </span>
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {tutor.subjects.map((sub) => (
                                  <span
                                    key={sub}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-900/50"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-3 sm:mt-0 text-left sm:text-right">
                              <div className="text-2xl font-black text-primary-600 dark:text-primary-400 tracking-tight">
                                NPR {tutor.price}
                              </div>
                              <span className="text-xs text-slate-400 font-medium">per hour</span>
                            </div>
                          </div>

                          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
                            {tutor.bio}
                          </p>

                          {/* Grade levels & location */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1 font-medium">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <MapPin className="h-3.5 w-3.5 text-primary-600 dark:text-primary-400" />
                              <span>{tutor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Levels:</span>
                              <span className="font-semibold text-slate-700 dark:text-slate-200">{tutor.gradeLevels.join(', ')}</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>Escrow Verified</span>
                            </div>
                          </div>

                          {/* Next-Level Action CTAs: Quick View, Book, Profile */}
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                            <button
                              onClick={() => {
                                try { sounds.playClick(); } catch {}
                                setPreviewTutor(tutor);
                              }}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                            >
                              <Eye className="h-3.5 w-3.5 text-primary-500" /> Quick Preview
                            </button>
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                            >
                              Profile & Reviews
                            </button>
                            <button
                              onClick={() => {
                                try { sounds.playClick(); } catch {}
                                setBookingTutor(tutor);
                              }}
                              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white text-xs font-black shadow-md shadow-primary-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-1.5 animate-shimmer"
                            >
                              <Calendar className="h-3.5 w-3.5" /> Book Session
                            </button>
                          </div>
                        </div>

                      </div>
                    </TiltCard>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 21st.dev Quick View Drawer Modal */}
      <TutorPreviewModal
        tutor={previewTutor}
        isOpen={!!previewTutor}
        onClose={() => setPreviewTutor(null)}
        onBook={(t) => {
          setPreviewTutor(null);
          setBookingTutor(t);
        }}
      />

      {/* Instant Booking & Payment Checkout Modal */}
      {bookingTutor && (
        <BookingModal
          tutor={bookingTutor}
          isOpen={!!bookingTutor}
          onClose={() => setBookingTutor(null)}
        />
      )}

    </div>
  );
};

export default Home;
