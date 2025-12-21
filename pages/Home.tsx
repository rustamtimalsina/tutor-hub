import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { MOCK_TUTORS, POPULAR_SUBJECTS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedSubject, setSelectedSubject] = useState('All subjects');
  const [selectedLevel, setSelectedLevel] = useState('All levels');

  const filteredTutors = MOCK_TUTORS.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = selectedSubject === 'All subjects' || tutor.subjects.includes(selectedSubject);
    const matchesPrice = tutor.price <= priceRange;
    return matchesSearch && matchesSubject && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white pt-20 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Find the Perfect Tutor for <br/> <span className="text-primary-600">Your Learning Needs</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Connect with expert tutors in Math, Science, English, and more. Boost your grades and learn at your own pace.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-32 py-4 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:text-lg shadow-lg"
              placeholder="Search by subject or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-2 top-2 bottom-2 bg-primary-600 text-white px-6 rounded-full font-medium hover:bg-primary-700 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_SUBJECTS.map((subject) => (
            <button 
              key={subject.id}
              onClick={() => setSelectedSubject(subject.name)}
              className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-200 transition-all group"
            >
              <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">{subject.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">{subject.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-primary-900">Filters</h3>
                <SlidersHorizontal className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                {/* Subject Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 border p-2"
                  >
                    <option>All subjects</option>
                    {POPULAR_SUBJECTS.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>

                {/* Grade Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level</label>
                  <select 
                     value={selectedLevel}
                     onChange={(e) => setSelectedLevel(e.target.value)}
                     className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 border p-2"
                  >
                    <option>All levels</option>
                    <option>Elementary</option>
                    <option>Middle School</option>
                    <option>High School</option>
                    <option>College</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Price Range</label>
                    <span className="text-xs text-gray-500">Max: NPR {priceRange}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="5000" 
                    step="100"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>5000/hr</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                   <div className="flex items-center space-x-2">
                      <input type="range" min="0" max="5" step="0.5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600" />
                      <span className="text-sm text-gray-600">0.0+</span>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedSubject('All subjects');
                    setPriceRange(5000);
                    setSearchTerm('');
                    setSelectedLevel('All levels');
                  }}
                  className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          {/* Tutor Listings */}
          <div className="w-full lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Available Tutors ({filteredTutors.length})</h2>
            </div>

            {filteredTutors.length === 0 ? (
               <div className="text-gray-500 text-center py-10">No tutors found matching your criteria. Try adjusting your filters.</div>
            ) : (
            <div className="space-y-4">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
                  {/* Avatar & Basic Info */}
                  <div className="flex-shrink-0 flex flex-col items-center md:items-start text-center md:text-left">
                    <img src={tutor.avatar} alt={tutor.name} className="h-24 w-24 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div className="mt-3 flex items-center justify-center md:justify-start">
                       <Star className="h-4 w-4 text-yellow-400 fill-current" />
                       <span className="ml-1 text-sm font-bold text-gray-900">{tutor.rating}</span>
                       <span className="ml-1 text-xs text-gray-500">({tutor.reviewCount})</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tutor.subjects.map(sub => (
                            <span key={sub} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-center md:text-right">
                         <div className="text-2xl font-bold text-primary-700">NPR {tutor.price}</div>
                         <div className="text-xs text-gray-500">per hour</div>
                      </div>
                    </div>

                    <p className="mt-3 text-gray-600 text-sm line-clamp-2">
                      {tutor.bio}
                    </p>
                    
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-0">
                           <MapPin className="h-4 w-4 mr-1" />
                           {tutor.location}
                        </div>
                        <div className="flex space-x-3 w-full sm:w-auto">
                            <button 
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                              View Profile
                            </button>
                            <button 
                              onClick={() => navigate(`/tutor/${tutor.id}`)}
                              className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 rounded-lg text-sm font-medium text-white hover:bg-primary-700 shadow-sm"
                            >
                              Book Now
                            </button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;