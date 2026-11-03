import { Tutor, Session, User, Review } from '../types';
import { MOCK_TUTORS, MOCK_STUDENT_SESSIONS, MOCK_REVIEWS, MOCK_USERS } from '../constants';

const API_BASE_URL = 'http://localhost:5000/api';

// Helper for fetch with timeout
async function fetchWithTimeout(resource: string, options: RequestInit = {}, timeout = 3500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  // Check backend server health
  async checkHealth(): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, { method: 'GET' }, 2000);
      return res.ok;
    } catch {
      return false;
    }
  },

  // 1. Tutors
  async getTutors(filters?: { subject?: string; maxPrice?: number; minRating?: number }): Promise<Tutor[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.subject && filters.subject !== 'All subjects') params.append('subject', filters.subject);
      if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
      if (filters?.minRating) params.append('minRating', String(filters.minRating));

      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await fetchWithTimeout(`${API_BASE_URL}/tutors${query}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unreachable, using local tutors store:', err);
    }
    return MOCK_TUTORS;
  },

  async getTutorById(id: string): Promise<Tutor | null> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/tutors/${id}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn(`Backend API unreachable for tutor ${id}:`, err);
    }
    return MOCK_TUTORS.find((t) => t.id === id) || null;
  },

  // 2. Bookings / Sessions
  async getBookings(): Promise<Session[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/bookings`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Backend API unreachable for bookings, using cached:', err);
    }
    const saved = localStorage.getItem('tutorHubSessions');
    return saved ? JSON.parse(saved) : MOCK_STUDENT_SESSIONS;
  },

  async createBooking(bookingData: Omit<Session, 'id'>): Promise<Session> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        body: JSON.stringify(bookingData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend API unreachable for createBooking, saving locally:', err);
    }
    // Fallback local session
    return {
      ...bookingData,
      id: `session-${Date.now()}`,
    };
  },

  // 3. Authentication
  async login(email: string, _password?: string, preferredRole?: 'student' | 'tutor'): Promise<User> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, role: preferredRole }),
      });
      if (res.ok) {
        const json = await res.json();
        const serverUser = json.user;
        const completeUser: User = {
          id: serverUser.id || `usr-${Date.now()}`,
          name: serverUser.name || (preferredRole === 'tutor' ? 'Rajesh Sharma' : 'Alex Johnson'),
          email: serverUser.email || email,
          role: serverUser.role || preferredRole || 'student',
          avatar: preferredRole === 'tutor' ? 'https://picsum.photos/seed/rajesh/200/200' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: new Date().toISOString().split('T')[0],
        };
        return completeUser;
      }
    } catch (err) {
      console.warn('Backend API login unavailable, using client authentication:', err);
    }

    // Client-side fallback
    const roleToUse = preferredRole || (email.includes('tutor') || email.includes('rajesh') ? 'tutor' : 'student');
    return {
      ...MOCK_USERS[roleToUse],
      email: email || MOCK_USERS[roleToUse].email,
    };
  },

  async register(userData: Partial<User> & { password?: string }): Promise<User> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.ok) {
        const json = await res.json();
        return {
          ...json.user,
          avatar: userData.avatar || (userData.role === 'tutor' 
            ? 'https://picsum.photos/seed/' + Date.now() + '/200/200' 
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'),
        };
      }
    } catch (err) {
      console.warn('Backend API register unavailable, registering locally:', err);
    }

    // Client-side fallback
    return {
      id: `usr-${Date.now()}`,
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
  },

  // 4. Reviews
  async getReviews(tutorId: string): Promise<Review[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/reviews/${tutorId}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn(`Backend API unreachable for reviews of tutor ${tutorId}:`, err);
    }
    const saved = localStorage.getItem('tutorHubReviews');
    const allReviews: Review[] = saved ? JSON.parse(saved) : MOCK_REVIEWS;
    return allReviews.filter((r) => r.tutorId === tutorId);
  },

  async createReview(reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (err) {
      console.warn('Backend API unreachable for createReview, saving locally:', err);
    }
    return {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
  },
};
