import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Star, SlidersHorizontal, ArrowRight, 
  Heart, Sparkles, Filter, CheckCircle2, Award, Zap
} from 'lucide-react';
import { POPULAR_SUBJECTS } from '../constants';
import Hero3DCanvas from '../components/Hero3DCanvas';
import TiltCard from '../components/TiltCard';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [selectedLevel, setSelectedLevel] = useState('All levels');
  const [minRating, setMinRating] = useState(0);

  // Fully working, comprehensive multi-filter logic
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
    setSelectedSubject('All subjects');
    setSelectedLevel('All levels');
    setPriceRange(5000);
    setMinRating(0);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* 3D Masterpiece Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white pt-20 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-primary-200 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              Next-Gen 3D Interactive Mentorship
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Master Any Subject with <br />
              <span className="bg-gradient-to-r from-primary-400 via-purple-300 to-accent-cyan bg-clip-text text-transparent">
                World-Class Mentors
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience personalized 1-on-1 learning with verified tutors in Math, Science, Coding, and Languages. Interactive, measurable, and engaging.
            </p>

            {/* Interactive Search Bar */}
            <div className="max-w-xl mx-auto lg:mx-0 relative pt-2">
              <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden p-1.5 bg-white/10 backdrop-blur-xl border border-white/20 focus-within:border-primary-400 transition-all">
                <div className="pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 px-3 py-2.5 sm:py-3 text-xs sm:text-base font-medium"
                  placeholder="Search by subject, tutor name, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('tutors-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Trust Points */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-300 font-semibold">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Verified Tutors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Top 1% Educators</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span>Instant Booking</span>
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

      {/* Popular Subjects Pill Grid */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
                  onClick={() => setSelectedSubject(subject.name)}
                  className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all group ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30 scale-105'
                      : 'bg-slate-50 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 hover:shadow-md border border-slate-200/60 dark:border-slate-700/80 hover:border-primary-300 dark:hover:border-primary-500'
                  }`}
                >
                  <span className={`text-2xl sm:text-3xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-125'}`}>
                    {subject.icon}
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {subject.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="tutors-catalog" className="py-6 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 sticky top-24 space-y-6 transition-colors">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Filters</h3>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  Reset all
                </button>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="All subjects">All subjects</option>
                  {POPULAR_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Grade Level Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Grade Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="All levels">All levels</option>
                  <option value="Elementary">Elementary</option>
                  <option value="Middle School">Middle School</option>
                  <option value="High School">High School</option>
                  <option value="College">College</option>
                </select>
              </div>

              {/* Hourly Price Range Slider */}
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

              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100/60 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                <span>Showing verified tutors with immediate 2026 calendar availability.</span>
              </div>

            </div>
          </aside>

          {/* Tutor Listings Grid */}
          <div className="flex-1">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Available Tutors</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Showing {filteredTutors.length} verified educator{filteredTutors.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {filteredTutors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">No tutors found</h3>
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
                      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-500 transition-all flex flex-col md:flex-row gap-6 relative">
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
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

                        {/* Avatar & Ratings */}
                        <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
                          <div className="relative">
                            <img
                              src={tutor.avatar}
                              alt={tutor.name}
                              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md ring-2 ring-slate-100 dark:ring-slate-700"
                            />
                            <span className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
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
                          </div>

                          {/* Card Actions */}
                          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all"
                            >
                              View Full Profile
                            </button>
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 hover:shadow-lg transition-all"
                            >
                              Book Session
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

    </div>
  );
};

export default Home;
