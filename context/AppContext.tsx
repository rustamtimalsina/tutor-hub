import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, Tutor, User, Review, AppNotification } from '../types';
import { MOCK_STUDENT_SESSIONS, MOCK_TUTORS, MOCK_USERS, MOCK_REVIEWS, MOCK_NOTIFICATIONS } from '../constants';
import { sounds } from '../utils/soundEffects';

interface AppContextType {
  currentUser: User | null;
  role: 'student' | 'tutor' | null;
  setRole: (role: 'student' | 'tutor' | null) => void;
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => void;
  cancelSession: (id: string) => void;
  savedTutorIds: string[];
  toggleSaveTutor: (id: string) => void;
  isTutorSaved: (id: string) => boolean;
  tutors: Tutor[];
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;
  notifications: AppNotification[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  login: (email: string, password?: string, preferredRole?: 'student' | 'tutor') => Promise<User>;
  register: (userData: Partial<User> & { password?: string }) => Promise<User>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user session
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tutorHubUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // If legacy role exists, initialize a default demo user
    const legacyRole = localStorage.getItem('tutorHubRole') as 'student' | 'tutor' | null;
    if (legacyRole && MOCK_USERS[legacyRole]) {
      return MOCK_USERS[legacyRole];
    }
    return null;
  });

  const [role, setRoleState] = useState<'student' | 'tutor' | null>(() => {
    if (currentUser) return currentUser.role;
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

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('tutorHubReviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_REVIEWS;
      }
    }
    return MOCK_REVIEWS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('tutorHubNotifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_NOTIFICATIONS;
      }
    }
    return MOCK_NOTIFICATIONS;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('tutorHubTheme') === 'dark';
  });

  // Sync user & role
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tutorHubUser', JSON.stringify(currentUser));
      localStorage.setItem('tutorHubRole', currentUser.role);
      setRoleState(currentUser.role);
    } else {
      localStorage.removeItem('tutorHubUser');
      if (!role) {
        localStorage.removeItem('tutorHubRole');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('tutorHubRole', role);
    }
  }, [role]);

  useEffect(() => {
    localStorage.setItem('tutorHubSessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('tutorHubSavedTutors', JSON.stringify(savedTutorIds));
  }, [savedTutorIds]);

  useEffect(() => {
    localStorage.setItem('tutorHubReviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('tutorHubNotifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tutorHubTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tutorHubTheme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    try {
      sounds.playClick();
    } catch {}
  };

  const setRole = (newRole: 'student' | 'tutor' | null) => {
    setRoleState(newRole);
    if (currentUser && newRole && currentUser.role !== newRole) {
      // Switch active user demo persona if switching roles
      const mockUser = MOCK_USERS[newRole];
      if (mockUser) {
        setCurrentUser(mockUser);
      } else {
        setCurrentUser((prev) => prev ? { ...prev, role: newRole } : null);
      }
    }
  };

  const login = async (email: string, _password?: string, preferredRole?: 'student' | 'tutor'): Promise<User> => {
    // Check if user exists in saved users registry
    const savedUsersStr = localStorage.getItem('tutorHubRegisteredUsers');
    const registeredUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    const matched = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (matched) {
      setCurrentUser(matched);
      setRoleState(matched.role);
      try {
        sounds.playSuccess();
      } catch {}
      return matched;
    }

    // Fallback to demo profiles
    const roleToUse = preferredRole || (email.includes('tutor') || email.includes('rajesh') ? 'tutor' : 'student');
    const demoUser: User = {
      ...MOCK_USERS[roleToUse],
      email: email || MOCK_USERS[roleToUse].email,
    };
    setCurrentUser(demoUser);
    setRoleState(demoUser.role);
    try {
      sounds.playSuccess();
    } catch {}
    return demoUser;
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<User> => {
    const newUser: User = {
      id: 'u_' + Date.now(),
      name: userData.name || 'New User',
      email: userData.email || 'user@example.com',
      role: userData.role || 'student',
      avatar: userData.avatar || (userData.role === 'tutor' 
        ? 'https://picsum.photos/seed/' + Date.now() + '/200/200' 
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
      gradeLevel: userData.gradeLevel,
      subjects: userData.subjects,
      hourlyRate: userData.hourlyRate,
      bio: userData.bio,
      location: userData.location || 'Nepal',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Store in registered users
    const savedUsersStr = localStorage.getItem('tutorHubRegisteredUsers');
    const registeredUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    registeredUsers.push(newUser);
    localStorage.setItem('tutorHubRegisteredUsers', JSON.stringify(registeredUsers));

    setCurrentUser(newUser);
    setRoleState(newUser.role);

    // Send a welcome notification
    addNotification({
      title: `Welcome to Tutor Hub 3D, ${newUser.name}! 🎉`,
      message: newUser.role === 'student' 
        ? 'Your student account is active. Explore verified educators and schedule your first 3D live session.' 
        : 'Your tutor profile is live! Set your available slots and start receiving session requests.',
      type: 'system',
      link: newUser.role === 'student' ? '/find-tutors' : '/tutor-dashboard',
    });

    try {
      sounds.playSuccess();
    } catch {}
    return newUser;
  };

  const logout = () => {
    setCurrentUser(null);
    setRoleState(null);
    localStorage.removeItem('tutorHubUser');
    localStorage.removeItem('tutorHubRole');
    try {
      sounds.playClick();
    } catch {}
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    // Update registered list if exists
    const savedUsersStr = localStorage.getItem('tutorHubRegisteredUsers');
    if (savedUsersStr) {
      try {
        const registeredUsers: User[] = JSON.parse(savedUsersStr);
        const next = registeredUsers.map((u) => (u.id === currentUser.id ? updated : u));
        localStorage.setItem('tutorHubRegisteredUsers', JSON.stringify(next));
      } catch {}
    }
  };

  const addSession = (sessionData: Omit<Session, 'id'>) => {
    const newSession: Session = {
      ...sessionData,
      id: 'session-' + Date.now(),
      studentName: currentUser?.name || 'Alex Johnson',
    };
    setSessions((prev) => [newSession, ...prev]);

    // Send notification
    addNotification({
      title: 'Booking Confirmed! 📅',
      message: `Your session for ${newSession.subject} with ${newSession.tutorName} on ${newSession.date} at ${newSession.time} is scheduled.`,
      type: 'booking',
      link: '/student-dashboard',
    });
  };

  const cancelSession = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled' as const } : s))
    );
    addNotification({
      title: 'Session Cancelled',
      message: 'A booked session was cancelled. A refund or reschedule credit is available.',
      type: 'reminder',
      link: '/student-dashboard',
    });
    try {
      sounds.playCancel();
    } catch {}
  };

  const toggleSaveTutor = (id: string) => {
    setSavedTutorIds((prev) => {
      const isSaved = prev.includes(id);
      try {
        sounds.playClick();
      } catch {}
      return isSaved ? prev.filter((item) => item !== id) : [...prev, id];
    });
  };

  const isTutorSaved = (id: string) => savedTutorIds.includes(id);

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Add notification
    addNotification({
      title: 'Review Published ⭐',
      message: `Your ${reviewData.rating}-star review for tutor was submitted successfully. Thank you!`,
      type: 'system',
      link: `/tutor/${reviewData.tutorId}`,
    });

    try {
      sounds.playSuccess();
    } catch {}
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      sounds.playClick();
    } catch {}
  };

  const clearNotifications = () => {
    setNotifications([]);
    try {
      sounds.playClick();
    } catch {}
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now(),
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        setRole,
        sessions,
        addSession,
        cancelSession,
        savedTutorIds,
        toggleSaveTutor,
        isTutorSaved,
        tutors,
        reviews,
        addReview,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        login,
        register,
        logout,
        updateProfile,
        darkMode,
        toggleDarkMode,
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
