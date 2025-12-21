import React from 'react';
import { Calendar, DollarSign, MessageSquare, Edit2, User, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TutorDashboard: React.FC = () => {
  const chartData = [
    { name: 'Mon', earnings: 1500 },
    { name: 'Tue', earnings: 3000 },
    { name: 'Wed', earnings: 1500 },
    { name: 'Thu', earnings: 4500 },
    { name: 'Fri', earnings: 2250 },
    { name: 'Sat', earnings: 6000 },
    { name: 'Sun', earnings: 3000 },
  ];

  // Mock messages for the messaging section
  const messages = [
     { id: 1, student: 'Aayush Tamang', text: 'Hi sir, can we focus on Calculus in the next session?', time: '2 mins ago', unread: true },
     { id: 2, student: 'Priya Maharjan', text: 'Thanks for the notes! They were really helpful.', time: '1 hour ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
       
       {/* Tutor Dashboard Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <img src="https://picsum.photos/seed/rajesh/200/200" alt="Rajesh Sharma" className="h-16 w-16 rounded-full object-cover border-2 border-primary-100" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Rajesh Sharma</h1>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <span className="bg-primary-100 text-primary-800 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-semibold">Tutor</span>
                  <span className="text-gray-400">•</span>
                  <span>Mathematics, Physics</span>
                </p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors text-gray-700">
             <Edit2 className="h-4 w-4" />
             Edit Profile
           </button>
        </div>
      </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
         {/* Stats Row */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
               <div>
                  <p className="text-sm font-medium text-gray-500">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-primary-900 mt-2">2</p>
               </div>
               <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                  <Calendar className="h-6 w-6" />
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
               <div>
                  <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                  <p className="text-3xl font-bold text-primary-900 mt-2">NPR 8250</p>
               </div>
               <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  <DollarSign className="h-6 w-6" />
               </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
               <div>
                  <p className="text-sm font-medium text-gray-500">Average Rating</p>
                  <p className="text-3xl font-bold text-primary-900 mt-2">4.8</p>
               </div>
               <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                  <User className="h-6 w-6" />
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             
             {/* Left Column: Schedule & Earnings */}
             <div className="lg:col-span-2 space-y-8">
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-primary-900">Upcoming Sessions</h2>
                        <button className="text-sm text-primary-600 font-medium hover:underline">View Schedule</button>
                    </div>
                    <div className="space-y-4">
                    {/* Card 1 */}
                    <div className="border border-primary-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-primary-50 transition-colors">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg text-gray-900">Aayush Tamang</h3>
                            <span className="bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded">Mathematics</span>
                            <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                                <span>📅 12/25/2025</span>
                                <span>⏰ 10:00 AM (1 hour)</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                             <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">Upcoming</span>
                             <button className="text-sm text-gray-500 hover:text-primary-600 underline">Message</button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="border border-primary-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-primary-50 transition-colors">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg text-gray-900">Priya Maharjan</h3>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">Physics</span>
                            <div className="mt-2 text-sm text-gray-500 flex items-center gap-4">
                                <span>📅 12/26/2025</span>
                                <span>⏰ 2:00 PM (1.5 hours)</span>
                            </div>
                        </div>
                         <div className="flex flex-col items-end gap-2">
                             <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">Upcoming</span>
                             <button className="text-sm text-gray-500 hover:text-primary-600 underline">Message</button>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Earnings Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-primary-900 mb-6">Weekly Earnings</h2>
                    <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: '#f5f3ff'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                        <Bar dataKey="earnings" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
             </div>

             {/* Right Column: Messages & Requests */}
             <div className="lg:col-span-1 space-y-8">
                 
                 {/* Student Messaging */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Student Messages</h2>
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <div className="space-y-4">
                       {messages.map(msg => (
                          <div key={msg.id} className={`p-3 rounded-lg border ${msg.unread ? 'bg-primary-50 border-primary-100' : 'bg-white border-gray-100'} hover:shadow-sm cursor-pointer transition-shadow`}>
                             <div className="flex justify-between items-start mb-1">
                                <span className={`font-bold text-sm ${msg.unread ? 'text-primary-900' : 'text-gray-900'}`}>{msg.student}</span>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                             </div>
                             <p className="text-xs text-gray-600 line-clamp-2">{msg.text}</p>
                          </div>
                       ))}
                    </div>
                    <button className="w-full mt-4 text-center text-sm text-primary-600 font-medium hover:text-primary-700 py-2 border border-dashed border-primary-200 rounded-lg hover:bg-primary-50">View All Messages</button>
                 </div>

                 {/* Session Requests (Mini) */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Pending Requests</h2>
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold text-xs">S</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Sita K.</p>
                                <p className="text-xs text-gray-500">Calculus • 1 Hour</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <button className="flex-1 bg-white border border-gray-200 text-gray-700 text-xs font-bold py-1.5 rounded shadow-sm hover:bg-gray-50">Decline</button>
                            <button className="flex-1 bg-primary-600 text-white text-xs font-bold py-1.5 rounded shadow-sm hover:bg-primary-700">Accept</button>
                        </div>
                    </div>
                 </div>

             </div>
         </div>

       </div>
    </div>
  );
};

export default TutorDashboard;