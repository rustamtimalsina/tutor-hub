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
    <div className="min-h-screen bg-slate-50/70">
      
      {/* 3D Masterpiece Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-primary-200 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              Next-Gen 3D Interactive Mentorship
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Master Any Subject with <br />
              <span className="bg-gradient-to-r from-primary-400 via-purple-300 to-accent-cyan bg-clip-text text-transparent">
                World-Class Mentors
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
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
                  className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 px-3 py-3 text-sm sm:text-base font-medium"
                  placeholder="Search by subject, tutor name, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  onClick={() => {
                    const el = document.getElementById('tutors-catalog');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold text-sm shadow-md shadow-primary-500/30 transition-all hover:scale-105"
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% Verified Tutors</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Top 1% Educators</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-cyan" />
                <span>Instant Booking</span>
              </div>
            </div>
          </div>

          {/* Right 3D Scene Column */}
          <div className="lg:col-span-5 h-[360px] sm:h-[420px] lg:h-[500px] flex items-center justify-center relative">
            <Hero3DCanvas />
          </div>

        </div>
      </section>

      {/* Popular Subjects Carousel / Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-glass border border-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Explore by Subject</h2>
              <p className="text-xs sm:text-sm text-slate-500">Pick a category to filter top tutors immediately</p>
            </div>
            <button 
              onClick={() => setSelectedSubject('All subjects')}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${
                selectedSubject === 'All subjects' 
                  ? 'bg-primary-600 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
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
                  className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all group ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 scale-105'
                      : 'bg-slate-50/80 hover:bg-white text-slate-700 hover:shadow-md border border-slate-100 hover:border-primary-200'
                  }`}
                >
                  <span className={`text-3xl mb-2 transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-125'}`}>
                    {subject.icon}
                  </span>
                  <span className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {subject.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section id="tutors-catalog" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-100 text-primary-700 rounded-lg">
                    <SlidersHorizontal className="h-4 w-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Filters</h3>
                </div>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-primary-600 hover:text-primary-800 font-semibold"
                >
                  Reset all
                </button>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="All subjects">All subjects</option>
                  {POPULAR_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* Grade Level Filter (Now fully functional!) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Grade Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
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
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Hourly Rate</label>
                  <span className="text-xs font-black text-primary-700 bg-primary-50 px-2 py-0.5 rounded-md">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                  <span>NPR 500</span>
                  <span>NPR 5,000/hr</span>
                </div>
              </div>

              {/* Rating Slider (Now fully functional!) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Minimum Rating</label>
                  <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
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
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium mt-1">
                  <span>Any</span>
                  <span>5.0 ⭐</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-100/60 text-xs text-indigo-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <span>Showing verified tutors with immediate 2026 calendar availability.</span>
              </div>

            </div>
          </aside>

          {/* Tutor Listings Grid */}
          <div className="flex-1">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Tutors</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Showing {filteredTutors.length} verified educator{filteredTutors.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {filteredTutors.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No tutors found</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
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
                      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 hover:shadow-xl hover:border-primary-200 transition-all flex flex-col md:flex-row gap-6 relative">
                        
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveTutor(tutor.id);
                          }}
                          className={`absolute top-5 right-5 p-2 rounded-full border transition-all z-20 ${
                            saved
                              ? 'bg-rose-50 border-rose-200 text-rose-500 scale-110'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50'
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
                              className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white shadow-md ring-2 ring-slate-100"
                            />
                            <span className="absolute -bottom-2 -right-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                              {tutor.availability}
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                            <Star className="h-4 w-4 text-amber-500 fill-current" />
                            <span className="text-xs font-black text-slate-900">{tutor.rating}</span>
                            <span className="text-[11px] text-slate-500">({tutor.reviewCount})</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-grow space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start pr-8">
                            <div>
                              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                {tutor.name}
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                  {tutor.experience}
                                </span>
                              </h3>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {tutor.subjects.map((sub) => (
                                  <span
                                    key={sub}
                                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100"
                                  >
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="mt-3 sm:mt-0 text-left sm:text-right">
                              <div className="text-2xl font-black text-primary-700 tracking-tight">
                                NPR {tutor.price}
                              </div>
                              <span className="text-xs text-slate-400 font-medium">per hour</span>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                            {tutor.bio}
                          </p>

                          {/* Grade levels & location */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-medium">
                            <div className="flex items-center gap-1 text-slate-600">
                              <MapPin className="h-3.5 w-3.5 text-primary-600" />
                              <span>{tutor.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-slate-400">Levels:</span>
                              <span className="font-semibold text-slate-700">{tutor.gradeLevels.join(', ')}</span>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
                            >
                              View Full Profile
                            </button>
                            <button
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-primary-300 hover:shadow-lg transition-all"
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
