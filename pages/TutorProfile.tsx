import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Book, ArrowLeft, Send, Heart, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';

const TutorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor } = useApp();
  
  const tutor = tutors.find((t) => t.id === id) || tutors[0];
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const saved = isTutorSaved(tutor.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-primary-600 mb-6 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={tutor.avatar} 
                    alt={tutor.name} 
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-lg ring-2 ring-slate-100" 
                  />
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {tutor.availability}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
                      {tutor.name}
                      <ShieldCheck className="h-6 w-6 text-primary-600" title="Verified Educator" />
                    </h1>
                    <button
                      onClick={() => toggleSaveTutor(tutor.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all mx-auto sm:mx-0 ${
                        saved 
                          ? 'bg-rose-50 border-rose-200 text-rose-600' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-xs font-black text-slate-900">{tutor.rating}</span>
                      <span className="text-xs text-slate-500 font-medium">({tutor.reviewCount} reviews)</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">•</span>
                    <span className="text-xs text-slate-600 font-semibold">{tutor.experience} Experience</span>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-4">
                    {tutor.subjects.map((s) => (
                      <span key={s} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-xl text-xs font-bold border border-primary-100">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      <span>{tutor.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600" /> About the Educator
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{tutor.bio}</p>
            </div>

            {/* Grade Levels Covered */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 mb-3">Academic Levels Covered</h2>
              <div className="flex flex-wrap gap-2">
                {tutor.gradeLevels.map((gl) => (
                  <span key={gl} className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold">
                    {gl}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center justify-between">
                <span>Verified Student Feedback</span>
                <span className="text-xs text-slate-400 font-medium">Based on recent sessions</span>
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-900">Aayush Tamang</span>
                    <div className="flex text-amber-500 text-xs">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="ml-1 font-bold text-slate-800">5.0</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Exceptional tutor! Clear conceptual clarity on calculus derivatives and linear algebra. Highly recommended.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">Verified Student • 2 weeks ago</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-sm text-slate-900">Priya Maharjan</span>
                    <div className="flex text-amber-500 text-xs">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="ml-1 font-bold text-slate-800">5.0</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Very patient and structured. Provided great study materials and notes after every session.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-2 block">Verified Student • 1 month ago</span>
                </div>
              </div>
            </div>

            {/* Interactive Send Message Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
              <h2 className="text-lg font-black text-slate-900 mb-2">Send a Message</h2>
              <p className="text-xs text-slate-500 mb-4">Have questions about syllabus coverage or schedule before booking?</p>
              
              {messageSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Your message has been sent to {tutor.name}! You will receive a response in Direct Messages.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                    rows={3} 
                    placeholder={`Write a message to ${tutor.name}...`}
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm transition-all"
                  >
                    <Send className="h-4 w-4" /> Send Direct Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-primary-200/80 p-6 sm:p-8 sticky top-24 space-y-6">
              <div className="text-center pb-6 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hourly Rate</span>
                <div className="text-4xl font-black text-primary-700 mt-1 tracking-tight">
                  NPR {tutor.price}
                </div>
                <span className="text-xs text-slate-400 font-medium">per 60-minute session</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>1-on-1 Interactive Video Classroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Live Whiteboard & Collaborative Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-primary-500/30 hover:scale-[1.02] transition-all"
              >
                Book a Session Now
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                No upfront commitment. Cancel up to 12 hours before session.
              </p>
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
