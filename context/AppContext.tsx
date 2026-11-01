import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, Tutor } from '../types';
import { MOCK_STUDENT_SESSIONS, MOCK_TUTORS } from '../constants';

interface AppContextType {
  role: 'student' | 'tutor' | null;
  setRole: (role: 'student' | 'tutor' | null) => void;
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  cancelSession: (id: string) => void;
  savedTutorIds: string[];
  toggleSaveTutor: (id: string) => void;
  isTutorSaved: (id: string) => boolean;
  tutors: Tutor[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<'student' | 'tutor' | null>(() => {
    return (localStorage.getItem('tutorHubRole') as 'student' | 'tutor') || null;
  });

  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('tutorHubSessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_STUDENT_SESSIONS;
      }
    }
    return MOCK_STUDENT_SESSIONS;
  });

  const [savedTutorIds, setSavedTutorIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tutorHubSavedTutors');
    return saved ? JSON.parse(saved) : ['1'];
  });

  const [tutors] = useState<Tutor[]>(MOCK_TUTORS);

  useEffect(() => {
    if (role) {
      localStorage.setItem('tutorHubRole', role);
    } else {
      localStorage.removeItem('tutorHubRole');
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('tutorHubSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('tutorHubSavedTutors', JSON.stringify(savedTutorIds));
  }, [savedTutorIds]);

  const setRole = (newRole: 'student' | 'tutor' | null) => {
    setRoleState(newRole);
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...sessionData,
      id: 'session-' + Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const cancelSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled' as const } : s))
    );
  };

  const toggleSaveTutor = (id: string) => {
    setSavedTutorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isTutorSaved = (id: string) => savedTutorIds.includes(id);

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        sessions,
        addSession,
        cancelSession,
        savedTutorIds,
        toggleSaveTutor,
        isTutorSaved,
        tutors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
