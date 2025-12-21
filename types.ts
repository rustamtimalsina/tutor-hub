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