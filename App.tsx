import React, { Component, ErrorInfo, ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TutorProfile from './pages/TutorProfile';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import Documentation from './pages/Documentation';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Classroom from './pages/Classroom';
import AIAssistantWidget from './components/AIAssistantWidget';
import { AppProvider } from './context/AppContext';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Caught Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="h-16 w-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-white mb-2">Something went wrong</h2>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {this.state.error?.message || 'An unexpected rendering error occurred. You can safely return to the home screen.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.hash = '#/';
                  window.location.reload();
                }}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper to conditionally render Navbar & Global AI Widget
const AppContent: React.FC = () => {
  const location = useLocation();
  // Hide Navbar on Welcome screen (root path), Auth page, and inside live Classroom
  const showNavbar = location.pathname !== '/' && location.pathname !== '/auth' && !location.pathname.startsWith('/classroom');

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
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

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-primary-500 selection:text-white transition-colors duration-200">
            <AppContent />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
