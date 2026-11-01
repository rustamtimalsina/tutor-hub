import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TutorProfile from './pages/TutorProfile';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import Documentation from './pages/Documentation';
import Welcome from './pages/Welcome';
import { AppProvider } from './context/AppContext';

// Wrapper to conditionally render Navbar
const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide Navbar on the Welcome screen (root path)
  const showNavbar = location.pathname !== '/';

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
          <Route path="/documentation" element={<Documentation />} />
        </Routes>
      </main>
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
