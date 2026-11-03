import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, Tutor, User, Review, AppNotification } from '../types';
import { MOCK_STUDENT_SESSIONS, MOCK_TUTORS, MOCK_USERS, MOCK_REVIEWS, MOCK_NOTIFICATIONS } from '../constants';
import { sounds } from '../utils/soundEffects';
import { api } from '../services/api';

interface AppContextType {
  currentUser: User | null;
  role: 'student' | 'tutor' | null;
  setRole: (role: 'student' | 'tutor' | null) => void;
  sessions: Session[];
  addSession: (session: Omit<Session, 'id'>) => Promise<void>;
  cancelSession: (id: string) => void;
  savedTutorIds: string[];
  toggleSaveTutor: (id: string) => void;
  isTutorSaved: (id: string) => boolean;
  tutors: Tutor[];
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
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
  isServerConnected: boolean;
  refreshServerData: () => Promise<void>;
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

  const [tutors, setTutors] = useState<Tutor[]>(MOCK_TUTORS);

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
    return localStorage.getItem('app_theme') === 'dark';
  });

  const [isServerConnected, setIsServerConnected] = useState<boolean>(false);

  // Sync data with backend on mount
  const refreshServerData = async () => {
    try {
      const connected = await api.checkHealth();
      setIsServerConnected(connected);

      if (connected) {
        const [serverTutors, serverBookings] = await Promise.all([
          api.getTutors(),
          api.getBookings(),
        ]);
        if (serverTutors && serverTutors.length > 0) {
          setTutors(serverTutors);
        }
        if (serverBookings && serverBookings.length > 0) {
          setSessions((prev) => {
            // Merge server bookings with local ones without duplicates
            const ids = new Set(serverBookings.map((b) => b.id));
            const localOnly = prev.filter((p) => !ids.has(p.id));
            return [...localOnly, ...serverBookings];
          });
        }
      }
    } catch (err) {
      console.warn('Error refreshing server data:', err);
      setIsServerConnected(false);
    }
  };

  useEffect(() => {
    refreshServerData();
  }, []);

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

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    try {
      sounds.playClick();
    } catch {}
  };

  const setRole = (newRole: 'student' | 'tutor' | null) => {
    setRoleState(newRole);
    if (currentUser && newRole && currentUser.role !== newRole) {
      const mockUser = MOCK_USERS[newRole];
      if (mockUser) {
        setCurrentUser(mockUser);
      } else {
        setCurrentUser((prev) => prev ? { ...prev, role: newRole } : null);
      }
    }
  };

  const login = async (email: string, password?: string, preferredRole?: 'student' | 'tutor'): Promise<User> => {
    // Call API client
    const user = await api.login(email, password, preferredRole);
    setCurrentUser(user);
    setRoleState(user.role);

    try {
      sounds.playSuccess();
    } catch {}
    return user;
  };

  const register = async (userData: Partial<User> & { password?: string }): Promise<User> => {
    // Call API client
    const newUser = await api.register(userData);

    // Store in registered users local backup
    const savedUsersStr = localStorage.getItem('tutorHubRegisteredUsers');
    const registeredUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : [];
    registeredUsers.push(newUser);
    localStorage.setItem('tutorHubRegisteredUsers', JSON.stringify(registeredUsers));

    setCurrentUser(newUser);
    setRoleState(newUser.role);

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
    const savedUsersStr = localStorage.getItem('tutorHubRegisteredUsers');
    if (savedUsersStr) {
      try {
        const registeredUsers: User[] = JSON.parse(savedUsersStr);
        const next = registeredUsers.map((u) => (u.id === currentUser.id ? updated : u));
        localStorage.setItem('tutorHubRegisteredUsers', JSON.stringify(next));
      } catch {}
    }
  };

  const addSession = async (sessionData: Omit<Session, 'id'>) => {
    // Create local representation
    const newSession: Session = {
      ...sessionData,
      id: 'session-' + Date.now(),
      studentName: currentUser?.name || 'Alex Johnson',
    };
    setSessions((prev) => [newSession, ...prev]);

    // Async push to backend API
    api.createBooking(newSession).catch((err) => {
      console.warn('Backend booking sync warning:', err);
    });

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

  const addReview = async (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      date: 'Just now',
    };
    setReviews((prev) => [newReview, ...prev]);

    // Async push to backend API
    api.createReview(newReview).catch((err) => {
      console.warn('Backend review sync warning:', err);
    });

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
        isServerConnected,
        refreshServerData,
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
