export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor';
  avatar: string;
  bio?: string;
  phone?: string;
  subjects?: string[];
  hourlyRate?: number;
  gradeLevel?: string;
  location?: string;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  rating: number;
  reviewCount: number;
  price: number;
  location: string;
  experience: string;
  bio: string;
  availability: 'Available' | 'Busy';
  gradeLevels: string[];
}

export interface Session {
  id: string;
  tutorName: string;
  studentName?: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface BookingDetails {
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  tutorId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'message' | 'system' | 'reminder';
  time: string;
  read: boolean;
  link?: string;
}
