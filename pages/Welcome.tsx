import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, GraduationCap } from 'lucide-react';

const Welcome: React.FC = () => {
  const [role, setRole] = useState<'student' | 'tutor' | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (role) {
      // Save role to localStorage to persist state for Navbar and other components
      localStorage.setItem('tutorHubRole', role);
      
      if (role === 'student') {
        navigate('/find-tutors');
      } else if (role === 'tutor') {
        navigate('/tutor-dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-3xl w-full text-center">
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
          Welcome to Tutor Hub
        </h1>
        <p className="text-gray-500 mb-10 text-lg">
          Choose how you want to use the platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Student Card */}
          <button
            onClick={() => setRole('student')}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 group ${
              role === 'student'
                ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200 ring-offset-2'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 transition-colors ${
              role === 'student' ? 'bg-primary-600 text-white' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
            }`}>
              <BookOpen className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Student</h3>
            <p className="text-sm text-gray-500 text-center">
              Find tutors and book learning sessions
            </p>
          </button>

          {/* Tutor Card */}
          <button
            onClick={() => setRole('tutor')}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 group ${
              role === 'tutor'
                ? 'border-primary-600 bg-primary-50 ring-2 ring-primary-200 ring-offset-2'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className={`p-4 rounded-full mb-4 transition-colors ${
              role === 'tutor' ? 'bg-primary-600 text-white' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
            }`}>
              <GraduationCap className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Tutor</h3>
            <p className="text-sm text-gray-500 text-center">
              Teach students and manage sessions
            </p>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!role}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            role
              ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-primary-300 transform hover:-translate-y-0.5'
              : 'bg-primary-200 text-white cursor-not-allowed'
          }`}
        >
          Continue
        </button>

      </div>
    </div>
  );
};

export default Welcome;