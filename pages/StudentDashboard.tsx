import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Edit2, User as UserIcon, 
  Trash2, Video, MessageSquare, Heart, CheckCircle2, AlertCircle, ArrowRight,
  Receipt, ShieldCheck, Send, Sparkles, X, Check, ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';
import { Session } from '../types';

interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  time: string;
}

const StudentDashboard: React.FC = () => {
  const { sessions, cancelSession, savedTutorIds, tutors, currentUser } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'saved' | 'messages'>('bookings');

  // Receipt Modal State
  const [selectedReceipt, setSelectedReceipt] = useState<Session | null>(null);

  // Stateful Chat System
  const [activeTutorChat, setActiveTutorChat] = useState({
    name: 'Rajesh Sharma',
    avatar: 'https://picsum.photos/seed/rajesh/100/100',
    subject: 'Calculus & Physics',
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'tutor',
      text: "Hi Alex! Don't forget our upcoming session scheduled for tomorrow. Have you had a chance to review derivatives?",
      time: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'student',
      text: "Yes sir! I solved problems 4 through 9, but I'm slightly confused on the chain rule substitution.",
      time: '10:02 AM',
    },
    {
      id: 'm3',
      sender: 'tutor',
      text: "No worries at all! We'll work through the chain rule on our 3D whiteboard with live formulas.",
      time: '10:05 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const studentName = currentUser?.name || 'Alex Johnson';
  const studentInitial = studentName.charAt(0).toUpperCase();

  const upcomingSessions = sessions.filter((s) => s.status === 'Upcoming');
  const pastSessions = sessions.filter((s) => s.status !== 'Upcoming');

  const savedTutorsList = tutors.filter((t) => savedTutorIds.includes(t.id));

  const totalSpent = sessions
    .filter((s) => s.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.price, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try { sounds.playClick(); } catch {}
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'student',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated mentor reply after 1.2s
    setTimeout(() => {
      try { sounds.playMessage(); } catch {}
      setChatMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'tutor',
          text: "Got your note! I'm prepping the practice questions now. See you in the live classroom!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

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
            onClick={() => {
              try { sounds.playClick(); } catch {}
              setActiveTab('bookings');
            }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'bookings'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            My Bookings ({upcomingSessions.length})
          </button>
          <button
            onClick={() => {
              try { sounds.playClick(); } catch {}
              setActiveTab('saved');
            }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'saved'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Saved Tutors ({savedTutorsList.length})
          </button>
          <button
            onClick={() => {
              try { sounds.playClick(); } catch {}
              setActiveTab('messages');
            }}
            className={`flex-1 py-3 text-center rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'messages'
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Messages & Inquiries
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-8">
            
            {/* Upcoming Sessions */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Upcoming Lessons ({upcomingSessions.length})
                </h2>
              </div>
              
              {upcomingSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map((session) => (
                    <div 
                      key={session.id} 
                      className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
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
                          <div className="text-right">
                            <span className="text-lg font-black text-slate-900 dark:text-white block">NPR {session.price}</span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <ShieldCheck className="h-3 w-3" /> Locked in Escrow
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                        <button 
                          onClick={() => {
                            try { sounds.playJoinCall(); } catch {}
                            navigate(`/classroom/${session.id}`);
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-primary-500/25 transition-all hover:scale-[1.02]"
                        >
                          <Video className="h-4 w-4" /> Enter 3D Classroom
                        </button>
                        <button
                          onClick={() => setSelectedReceipt(session)}
                          className="px-3 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                          title="View Escrow Receipt"
                        >
                          <Receipt className="h-3.5 w-3.5 text-primary-500" /> Receipt
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
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                          {session.date} • {session.duration} • NPR {session.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedReceipt(session)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1"
                        >
                          <Receipt className="h-3.5 w-3.5 text-primary-500" /> Receipt
                        </button>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          session.status === 'Completed'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200/60 dark:border-slate-800">
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
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              Saved Educators ({savedTutorsList.length})
            </h2>

            {savedTutorsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTutorsList.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="h-16 w-16 rounded-2xl object-cover ring-2 ring-primary-500"
                      />
                      <div>
                        <h3 className="font-black text-base text-slate-900 dark:text-white">{tutor.name}</h3>
                        <p className="text-xs text-slate-400">{tutor.experience} Experience</p>
                        <span className="text-xs font-black text-primary-600 dark:text-primary-400">
                          NPR {tutor.price}/hr
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => navigate(`/tutor/${tutor.id}`)}
                        className="flex-1 py-2 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-primary-700 transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-dashed border-slate-300 dark:border-slate-700">
                <Heart className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-700 dark:text-slate-200 font-bold">You haven't bookmarked any tutors yet.</p>
                <p className="text-slate-400 text-xs mt-1 mb-4">Click the heart icon on any tutor card to save them for easy booking.</p>
                <Link
                  to="/find-tutors"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-primary-700 transition-all"
                >
                  Explore Tutors <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Interactive Stateful Messages & Inquiries */}
        {activeTab === 'messages' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
            
            {/* Left Chats List */}
            <div className="border-r border-slate-100 dark:border-slate-800 p-4 space-y-2 bg-slate-50/50 dark:bg-slate-950/40">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Recent Chats</h3>
              
              <div 
                onClick={() => {
                  setActiveTutorChat({
                    name: 'Rajesh Sharma',
                    avatar: 'https://picsum.photos/seed/rajesh/100/100',
                    subject: 'Calculus & Physics',
                  });
                }}
                className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-primary-200 dark:border-primary-900/60 shadow-sm cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Rajesh Sharma</span>
                  <span className="text-[10px] text-primary-600 dark:text-primary-400 font-semibold">Active</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {chatMessages[chatMessages.length - 1]?.text || 'No messages yet'}
                </p>
              </div>

              <div 
                onClick={() => {
                  setActiveTutorChat({
                    name: 'Anita Shrestha',
                    avatar: 'https://picsum.photos/seed/anita/100/100',
                    subject: 'Chemistry & Biology',
                  });
                }}
                className="p-3 bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Anita Shrestha</span>
                  <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Great work on the organic reaction quiz!
                </p>
              </div>
            </div>

            {/* Right Chat Thread */}
            <div className="md:col-span-2 p-5 sm:p-6 flex flex-col justify-between bg-white dark:bg-slate-900">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeTutorChat.avatar} 
                      alt={activeTutorChat.name} 
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary-500" 
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{activeTutorChat.name}</h4>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Online Mentor
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      try { sounds.playJoinCall(); } catch {}
                      navigate('/classroom/s1');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  >
                    <Video className="h-3.5 w-3.5" /> Start Call
                  </button>
                </div>

                {/* Messages Feed */}
                <div className="py-6 space-y-4 text-xs max-h-[340px] overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                          msg.sender === 'student'
                            ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-primary-500/10'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`block text-[9px] mt-1 ${msg.sender === 'student' ? 'text-white/70' : 'text-slate-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Type a message to ${activeTutorChat.name}...`}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                />
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20 flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        )}

      </div>

      {/* Escrow Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative text-slate-800 dark:text-slate-100">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Escrow Payment Receipt</h3>
                  <span className="text-[10px] text-slate-400 font-mono">TXN-NP-{selectedReceipt.id.toUpperCase()}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-5 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="font-bold text-slate-900 dark:text-white">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Educator:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.tutorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.date} @ {selectedReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReceipt.duration}</span>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500">Amount Paid:</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">NPR {selectedReceipt.price}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Payment locked in 256-bit encrypted escrow sandbox.</span>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  try { sounds.playJoinCall(); } catch {}
                  setSelectedReceipt(null);
                  navigate(`/classroom/${selectedReceipt.id}`);
                }}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/25 flex items-center justify-center gap-1.5"
              >
                <Video className="h-3.5 w-3.5" /> Launch Classroom
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StudentDashboard;
