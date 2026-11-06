import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, MessageSquare, Edit2, User, Clock, CheckCircle, Video, TrendingUp, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const TutorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, currentUser } = useApp();
  const tutorName = currentUser?.name || 'Rajesh Sharma';
  const tutorAvatar = currentUser?.avatar || 'https://picsum.photos/seed/rajesh/200/200';
  const [pendingRequests, setPendingRequests] = useState([
    { id: 'req-1', student: 'Sita Karki', subject: 'Advanced Calculus', duration: '1 Hour', fee: 1500, time: 'Tomorrow @ 11:00 AM' },
    { id: 'req-2', student: 'Bikram Thapa', subject: 'Quantum Physics', duration: '2 Hours', fee: 3000, time: 'Wednesday @ 3:00 PM' },
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [hourlyRate, setHourlyRate] = useState(1500);

  const chartData = [
    { name: 'Mon', earnings: 1500 },
    { name: 'Tue', earnings: 3000 },
    { name: 'Wed', earnings: 1500 },
    { name: 'Thu', earnings: 4500 },
    { name: 'Fri', earnings: 2250 },
    { name: 'Sat', earnings: 6000 },
    { name: 'Sun', earnings: 3000 },
  ];

  const messages = [
    { id: 1, student: 'Aayush Tamang', text: 'Hi sir, can we focus on Calculus in the next session?', time: '2 mins ago', unread: true },
    { id: 2, student: 'Priya Maharjan', text: 'Thanks for the notes! They were really helpful.', time: '1 hour ago', unread: false },
  ];

  const handleAcceptRequest = (id: string, name: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setNotification(`Accepted request from ${name}! Booking has been confirmed.`);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch {}
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeclineRequest = (id: string) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== id));
    setNotification('Request declined.');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 transition-colors duration-200">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-bounce border border-slate-700">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tutor Dashboard Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-8 mb-8 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={tutorAvatar}
                alt={tutorName}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-primary-200 dark:border-primary-800 shadow-md ring-2 ring-primary-50 dark:ring-primary-900/40"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-full uppercase tracking-wider">
                Online
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{tutorName}</h1>
                <span className="bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-primary-200 dark:border-primary-900/50">
                  Verified Educator
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-medium">
                {currentUser?.bio || 'Senior Mathematics & Physics Specialist • M.Sc. Tribhuvan University'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors text-slate-700 dark:text-slate-200 shadow-sm"
            >
              <Edit2 className="h-4 w-4" />
              Tutor Profile Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bookings</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{sessions.length + 2}</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +18% this month
              </span>
            </div>
            <div className="p-3 bg-primary-50 dark:bg-primary-950/50 rounded-2xl text-primary-600 dark:text-primary-400">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Earnings</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">NPR 28,500</p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Next payout in 2 days
              </span>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 flex items-start justify-between transition-colors">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Student Rating</span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">4.9 / 5.0</p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold mt-1 inline-block">
                Top Rated Educator 🏆
              </span>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl text-amber-600 dark:text-amber-400">
              <User className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Main Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column: Schedule & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Upcoming Sessions List */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Confirmed Schedule</h2>
                  <p className="text-xs text-slate-400 font-medium">Upcoming 1-on-1 student classroom sessions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-primary-200 dark:hover:border-primary-700 transition-colors gap-4">
                  <div>
                    <span className="bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-primary-100 dark:border-primary-900/50">
                      Mathematics
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">Aayush Tamang</h3>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>📅 Tomorrow @ 10:00 AM</span>
                      <span>• 1 Hour (NPR 1,500)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => navigate('/classroom/session-aayush')}
                      className="flex-1 md:flex-none px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105"
                    >
                      <Video className="h-3.5 w-3.5" /> Launch Classroom
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-primary-200 dark:hover:border-primary-700 transition-colors gap-4">
                  <div>
                    <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/50">
                      Physics
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">Priya Maharjan</h3>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
                      <span>📅 Thursday @ 2:00 PM</span>
                      <span>• 1.5 Hours (NPR 2,250)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => navigate('/classroom/session-priya')}
                      className="flex-1 md:flex-none px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-105"
                    >
                      <Video className="h-3.5 w-3.5" /> Launch Classroom
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Earnings Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Weekly Performance Chart</h2>
                  <p className="text-xs text-slate-400 font-medium">Session revenues recorded in NPR</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ borderRadius: '16px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
                    />
                    <Bar dataKey="earnings" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column: Pending Requests & Messages */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Pending Booking Requests */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Pending Student Inquiries ({pendingRequests.length})</h3>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">New</span>
              </div>

              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-sm">{req.student}</h4>
                          <span className="text-xs text-primary-700 dark:text-primary-300 font-semibold">{req.subject}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">NPR {req.fee}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{req.time} • {req.duration}</p>
                      
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="flex-1 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 rounded-xl text-xs font-bold transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req.id, req.student)}
                          className="flex-1 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  All student booking requests have been reviewed!
                </div>
              )}
            </div>

            {/* Direct Messages */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Student Direct Messages</h3>
                <MessageSquare className="h-4 w-4 text-slate-400" />
              </div>

              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{msg.student}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Tutor Profile Settings Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Educator Profile Settings</h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-slate-400 text-[10px]">Hourly Rate (NPR)</label>
                <input 
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-slate-400 text-[10px]">Teaching Bio</label>
                <textarea 
                  defaultValue="Senior educator with M.Sc. in Physics. Specialized in calculus, mechanics, and exam preparation for high school & college students."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-medium"
                  rows={3}
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider text-slate-400 text-[10px]">Escrow Payout Wallet (eSewa / Khalti)</label>
                <input 
                  type="text"
                  defaultValue="9801234567"
                  placeholder="Enter 10-digit mobile wallet ID"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[10px] text-slate-400 font-normal mt-1 block">Escrow payouts are disbursed directly to this mobile wallet upon lesson sign-off.</span>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span>Verified Master Tier • Instant escrow withdrawal verified</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setNotification('Profile settings saved successfully!');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-500/20"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-5 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDashboard;
