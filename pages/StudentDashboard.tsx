import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Edit2, User as UserIcon, 
  Trash2, Video, MessageSquare, Heart, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const StudentDashboard: React.FC = () => {
  const { sessions, cancelSession, savedTutorIds, tutors, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'messages'>('bookings');

  const studentName = currentUser?.name || 'Alex Johnson';
  const studentInitial = studentName.charAt(0).toUpperCase();

  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const pastSessions = sessions.filter((s) => s.status !== 'Upcoming');

  const savedTutorsList = tutors.filter((t) => savedTutorIds.includes(t.id));

  const totalSpent = sessions
    .filter((s) => s.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 transition-colors duration-200">
      
      {/* Dashboard Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={studentName}
                className="h-20 w-20 rounded-2xl object-cover shadow-lg border-2 border-white/20 ring-2 ring-primary-500/30"
              />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-indigo-400 text-white flex items-center justify-center text-3xl font-black shadow-lg border-2 border-white/20">
                {studentInitial}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{studentName}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Active Student
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                {currentUser?.gradeLevel || 'Computer Science & Advanced Mathematics • Grade 12'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/find-tutors"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/30 transition-all hover:scale-105"
            >
              <Search className="h-4 w-4" /> 
              Find New Tutors
            </Link>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 text-white">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Sessions</span>
            <p className="text-2xl font-black text-white mt-1">{sessions.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-slate-400 font-semibold uppercase">Upcoming</span>
            <p className="text-2xl font-black text-amber-300 mt-1">{upcomingSessions.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-slate-400 font-semibold uppercase">Saved Tutors</span>
            <p className="text-2xl font-black text-rose-300 mt-1">{savedTutorsList.length}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Invested</span>
            <p className="text-2xl font-black text-emerald-300 mt-1">NPR {totalSpent}</p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-1.5 flex gap-2 transition-colors">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'bookings'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            My Bookings ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'saved'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Saved Tutors ({savedTutorsList.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'messages'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Direct Messages (2)
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            
            {/* Upcoming Sessions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Upcoming Sessions ({upcomingSessions.length})
                </h2>
              </div>
              
              {upcomingSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 font-bold text-xs px-3 py-1 rounded-full border border-primary-100 dark:border-primary-900/50">
                              {session.subject}
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">{session.tutorName}</h3>
                          </div>
                          <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-900/50">
                            Upcoming
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            <span>{session.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                            <span>{session.time} ({session.duration})</span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-medium">Session Fee:</span>
                          <span className="text-lg font-black text-slate-900 dark:text-white">NPR {session.price}</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <button 
                          onClick={() => navigate(`/classroom/${session.id}`)}
                          className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
                        >
                          <Video className="h-4 w-4" /> Join Live Classroom
                        </button>
                        <button
                          onClick={() => cancelSession(session.id)}
                          className="px-3 py-2.5 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold transition-all"
                          title="Cancel session"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-700">
                  <Calendar className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-700 dark:text-slate-200 font-bold">No upcoming sessions right now.</p>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Book your next 1-on-1 session with an expert tutor.</p>
                  <Link 
                    to="/find-tutors" 
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-700 transition-all"
                  >
                    Browse Available Tutors <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Past Sessions */}
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                Completed & Past Sessions ({pastSessions.length})
              </h2>
              
              <div className="space-y-3">
                {pastSessions.length > 0 ? (
                  pastSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white">{session.tutorName}</h4>
                          <span className="text-xs bg-slate-100 dark:bg-slate-800 font-semibold px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            {session.subject}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                          <span>{session.date} • {session.time}</span>
                          <span>• NPR {session.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        {session.status === 'Completed' ? (
                          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-full font-bold">
                            Completed
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs rounded-full font-bold">
                            Cancelled
                          </span>
                        )}
                        <button 
                          onClick={() => navigate('/find-tutors')}
                          className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          Book Again
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center text-slate-400 text-sm border border-slate-200/80 dark:border-slate-800">
                    No past sessions yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Saved Tutors */}
        {activeTab === 'saved' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Saved Mentors</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Quickly rebook or view profiles of tutors you've bookmarked.</p>
            </div>

            {savedTutorsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTutorsList.map((tutor) => (
                  <div key={tutor.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img src={tutor.avatar} alt={tutor.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-white dark:border-slate-800 shadow-md ring-2 ring-slate-100 dark:ring-slate-700" />
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">{tutor.name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{tutor.experience}</span>
                          <p className="text-sm font-black text-primary-600 dark:text-primary-400 mt-1">NPR {tutor.price}/hr</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">{tutor.bio}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <button
                        onClick={() => navigate(`/tutor/${tutor.id}`)}
                        className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all text-center"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border border-dashed border-slate-300 dark:border-slate-700">
                <Heart className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-700 dark:text-slate-200 font-bold">You haven't saved any tutors yet.</p>
                <p className="text-slate-400 text-xs mt-1 mb-4">Click the heart icon on any tutor card to save them here.</p>
                <Link to="/find-tutors" className="px-5 py-2.5 bg-primary-600 text-white font-bold text-xs rounded-xl shadow-md">
                  Explore Tutors
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
            <div className="border-r border-slate-100 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Recent Chats</h3>
              <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-primary-900/60 shadow-sm cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Rajesh Sharma</span>
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">10:45 AM</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">I've uploaded the calculus problem set for tomorrow!</p>
              </div>
              <div className="p-3 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Anita Shrestha</span>
                  <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Great work on the organic chemistry reaction quiz!</p>
              </div>
            </div>

            <div className="md:col-span-2 p-6 flex flex-col justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/rajesh/100/100" alt="Rajesh" className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Rajesh Sharma</h4>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate('/classroom/s1')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 hover:bg-primary-100 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  >
                    <Video className="h-3.5 w-3.5" /> Start Call
                  </button>
                </div>

                <div className="py-6 space-y-4 text-xs">
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      Hi Alex! Don't forget our session scheduled for tomorrow. Have you had a chance to look at derivatives?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="p-3.5 rounded-2xl bg-primary-600 text-white max-w-[80%]">
                      Yes sir! I solved exercises 4 through 9, but got stuck on the chain rule problem.
                    </div>
                  </div>
                  <div className="flex gap-2 max-w-[80%]">
                    <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      I've uploaded the calculus problem set for tomorrow! We will crack it together.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message to Rajesh..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
                <button className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default StudentDashboard;
