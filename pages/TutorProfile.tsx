import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Book, ArrowLeft, Send } from 'lucide-react';
import { MOCK_TUTORS } from '../constants';
import BookingModal from '../components/BookingModal';

const TutorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutor = MOCK_TUTORS.find(t => t.id === id);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (!tutor) return <div className="p-10 text-center">Tutor not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <div className="flex flex-col sm:flex-row items-start gap-6">
                  <img src={tutor.avatar} alt={tutor.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary-50" />
                  <div className="flex-1">
                     <h1 className="text-2xl font-bold text-gray-900">{tutor.name}</h1>
                     <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-yellow-500">
                           <Star className="h-5 w-5 fill-current" />
                           <span className="ml-1 font-bold text-gray-900">{tutor.rating}</span>
                           <span className="ml-1 text-gray-500">({tutor.reviewCount} reviews)</span>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-2 mt-4">
                        {tutor.subjects.map(s => (
                           <span key={s} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">{s}</span>
                        ))}
                     </div>
                     <div className="flex items-center mt-4 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {tutor.location}
                        <span className="mx-3">•</span>
                        <Book className="h-4 w-4 mr-1" />
                        {tutor.experience} of teaching experience
                     </div>
                  </div>
               </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <h2 className="text-xl font-bold text-primary-900 mb-4">About Me</h2>
               <p className="text-gray-600 leading-relaxed">{tutor.bio}</p>
            </div>

            {/* Grade Levels */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <h2 className="text-xl font-bold text-primary-900 mb-4">Grade Levels</h2>
               <div className="flex gap-2">
                 {tutor.gradeLevels.map(gl => (
                   <span key={gl} className="px-3 py-1 border border-primary-200 text-primary-700 rounded-md text-sm">{gl}</span>
                 ))}
               </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <h2 className="text-xl font-bold text-primary-900 mb-4">Availability</h2>
               <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                     <Clock className="h-5 w-5 mr-3 text-primary-500" />
                     <span>Mon 9am-5pm</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                     <Clock className="h-5 w-5 mr-3 text-primary-500" />
                     <span>Wed 9am-5pm</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                     <Clock className="h-5 w-5 mr-3 text-primary-500" />
                     <span>Fri 9am-5pm</span>
                  </div>
               </div>
            </div>

            {/* Reviews (Static Mock) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-primary-900 mb-6">Student Reviews</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-50 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">Aayush Tamang</span>
                    <div className="flex text-yellow-400 text-xs"><Star className="h-3 w-3 fill-current"/><span className="ml-1 text-gray-600">5</span></div>
                  </div>
                  <p className="text-gray-600 text-sm">Rajesh sir is an amazing tutor! He helped me improve my calculus grade significantly.</p>
                  <p className="text-xs text-gray-400 mt-2">1/15/2024</p>
                </div>
                <div className="border-b border-gray-50 pb-6">
                   <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900">Priya Maharjan</span>
                    <div className="flex text-yellow-400 text-xs"><Star className="h-3 w-3 fill-current"/><span className="ml-1 text-gray-600">5</span></div>
                  </div>
                  <p className="text-gray-600 text-sm">Very patient and explains concepts clearly. Highly recommend!</p>
                  <p className="text-xs text-gray-400 mt-2">1/10/2024</p>
                </div>
              </div>
            </div>

            {/* Send Message Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-primary-900 mb-4">Send Message</h2>
              <textarea className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-primary-500 focus:border-primary-500" rows={4} placeholder="Write your message to the tutor..."></textarea>
              <button className="mt-3 w-full bg-primary-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-700 flex justify-center items-center">
                 <Send className="h-4 w-4 mr-2" /> Send Message
              </button>
            </div>

          </div>

          {/* Sidebar (Pricing & Action) */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 sticky top-24">
                <div className="text-center mb-6">
                   <span className="text-gray-500 text-sm uppercase tracking-wide">Hourly Rate</span>
                   <div className="text-4xl font-extrabold text-primary-600 mt-1">NPR {tutor.price}</div>
                   <div className="text-gray-400 text-xs mt-1">per hour</div>
                </div>
                
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-200 transition-all transform hover:-translate-y-0.5"
                >
                   Book a Session
                </button>
             </div>
          </div>
        </div>
      </div>
      
      <BookingModal 
        tutor={tutor} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

export default TutorProfile;