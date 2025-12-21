import React from 'react';
import { Calendar, Clock, Search, Edit2, User as UserIcon } from 'lucide-react';
import { MOCK_STUDENT_SESSIONS } from '../constants';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const upcomingSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status === 'Upcoming');
  const pastSessions = MOCK_STUDENT_SESSIONS.filter(s => s.status !== 'Upcoming');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-primary-800 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-white text-primary-700 flex items-center justify-center text-2xl font-bold border-4 border-primary-400/30">
                A
              </div>
              <div>
                <h1 className="text-2xl font-bold">Alex Johnson</h1>
                <p className="text-primary-200 text-sm flex items-center gap-2">
                  <span className="bg-primary-700/50 px-2 py-0.5 rounded text-xs uppercase tracking-wide font-semibold">Student</span>
                </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-primary-700 hover:bg-primary-600 rounded-lg text-sm font-medium transition-colors border border-primary-600">
               <Edit2 className="h-4 w-4" />
               Edit Profile
             </button>
             <Link to="/find-tutors" className="flex items-center gap-2 px-4 py-2 bg-white text-primary-800 hover:bg-gray-100 rounded-lg text-sm font-bold transition-colors shadow-sm">
               <Search className="h-4 w-4" /> 
               Find Tutors
             </Link>
           </div>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex overflow-hidden">
           <button className="flex-1 py-4 text-center text-primary-700 font-medium border-b-2 border-primary-600 bg-primary-50">My Bookings</button>
           <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 font-medium">Messages</button>
           <button className="flex-1 py-4 text-center text-gray-500 hover:bg-gray-50 font-medium">Saved Tutors</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upcoming Sessions */}
        <div>
           <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
           </div>
           
           {upcomingSessions.length > 0 ? (
             <div className="space-y-4">
               {upcomingSessions.map(session => (
                 <div key={session.id} className="bg-white rounded-xl p-6 border border-primary-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:border-primary-200 transition-colors">
                   <div>
                     <h3 className="text-lg font-bold text-gray-900">{session.tutorName}</h3>
                     <div className="flex items-center gap-2 mt-1">
                        <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-0.5 rounded font-medium">{session.subject}</span>
                     </div>
                     <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {session.date}</div>
                        <div className="flex items-center"><Clock className="h-4 w-4 mr-1.5" /> {session.time} ({session.duration})</div>
                     </div>
                     <div className="mt-2 font-bold text-primary-600 text-sm">NPR {session.price}</div>
                   </div>
                   <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                     <button className="flex-1 md:flex-none px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50">Reschedule</button>
                     <button className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50">Cancel</button>
                   </div>
                 </div>
               ))}
             </div>
           ) : (
              <div className="bg-white rounded-xl p-8 text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No upcoming sessions.</p>
                  <Link to="/find-tutors" className="text-primary-600 font-medium mt-2 inline-block hover:underline">Book a tutor now</Link>
              </div>
           )}
        </div>

        {/* Past Sessions */}
        <div>
           <h2 className="text-xl font-bold text-gray-900 mb-4">Past Sessions</h2>
           <div className="space-y-4">
             {pastSessions.length > 0 ? pastSessions.map(session => (
               <div key={session.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm opacity-80">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                   <div>
                      <h3 className="font-bold text-gray-900">{session.tutorName}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 mt-1 inline-block">{session.subject}</span>
                      <div className="text-sm text-gray-500 mt-2">{session.date} • {session.time}</div>
                   </div>
                   <div className="mt-3 sm:mt-0 flex items-center gap-3">
                     <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Completed</span>
                     <button className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">View Details</button>
                   </div>
                 </div>
               </div>
             )) : (
               <div className="bg-white rounded-xl p-10 text-center border border-gray-100 text-gray-400">
                  No past sessions history found.
               </div>
             )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;