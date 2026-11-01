import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TutorProfile from './pages/TutorProfile';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import Documentation from './pages/Documentation';
import Welcome from './pages/Welcome';
import Classroom from './pages/Classroom';
import AIAssistantWidget from './components/AIAssistantWidget';
import { AppProvider } from './context/AppContext';

// Wrapper to conditionally render Navbar & Global AI Widget
const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide Navbar on the Welcome screen (root path) and inside live Classroom
  const showNavbar = location.pathname !== '/' && !location.pathname.startsWith('/classroom');

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/find-tutors" element={<Home />} />
          <Route path="/tutor/:id" element={<TutorProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/tutor-dashboard" element={<TutorDashboard />} />
          <Route path="/classroom/:sessionId" element={<Classroom />} />
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </main>
      <AIAssistantWidget />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
