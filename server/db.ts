import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DBUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'tutor';
  avatar: string;
  gradeLevel?: string;
  hourlyRate?: number;
  subjects?: string[];
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface DBSession {
  id: string;
  tutorName: string;
  studentName: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  paymentRef?: string;
  escrowStatus?: 'Held' | 'Released' | 'Refunded';
  createdAt: string;
}

export interface DBReview {
  id: string;
  tutorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DatabaseSchema {
  users: DBUser[];
  tutors: any[];
  bookings: DBSession[];
  reviews: DBReview[];
}

const DEFAULT_DB: DatabaseSchema = {
  users: [
    {
      id: 'u_student_1',
      name: 'Alex Johnson',
      email: 'alex@student.edu',
      passwordHash: bcrypt.hashSync('studentPass123!', 10),
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      gradeLevel: 'High School (Grade 11)',
      bio: 'Aspiring engineer passionate about Mathematics and Physics.',
      createdAt: '2025-01-15',
    },
    {
      id: 'u_tutor_1',
      name: 'Rajesh Sharma',
      email: 'rajesh@tutorhub.com',
      passwordHash: bcrypt.hashSync('tutorSecret999!', 10),
      role: 'tutor',
      avatar: 'https://picsum.photos/seed/rajesh/200/200',
      subjects: ['Mathematics', 'Physics'],
      hourlyRate: 1500,
      location: 'Kathmandu, Nepal',
      bio: 'Experienced educator with 8+ years making STEM accessible and intuitive.',
      createdAt: '2024-06-20',
    },
  ],
  tutors: [
    {
      id: '1',
      name: 'Rajesh Sharma',
      avatar: 'https://picsum.photos/seed/rajesh/300/300',
      subjects: ['Mathematics', 'Physics'],
      rating: 4.9,
      reviewCount: 38,
      price: 1500,
      location: 'Kathmandu, Bagmati',
      experience: '8+ Years',
      bio: 'Dedicated educator with M.Sc. in Physics. Specialized in calculus, mechanics, and exam preparation for high school & college students.',
      availability: 'Available',
      gradeLevels: ['High School', 'College'],
    },
    {
      id: '2',
      name: 'Anita Shrestha',
      avatar: 'https://picsum.photos/seed/anita/300/300',
      subjects: ['Chemistry', 'Biology'],
      rating: 4.8,
      reviewCount: 29,
      price: 1200,
      location: 'Lalitpur, Bagmati',
      experience: '5+ Years',
      bio: 'Passionate about medical biology and organic chemistry. Simplifying complex molecular reactions for aspiring medical students.',
      availability: 'Available',
      gradeLevels: ['Middle School', 'High School', 'College'],
    },
    {
      id: '3',
      name: 'Bikash Adhikari',
      avatar: 'https://picsum.photos/seed/bikash/300/300',
      subjects: ['Computer Science', 'Mathematics'],
      rating: 5.0,
      reviewCount: 45,
      price: 2000,
      location: 'Pokhara, Gandaki',
      experience: '7+ Years',
      bio: 'Software engineer and coding instructor. Teaching Python, Web Development, Algorithms, and Data Structures.',
      availability: 'Available',
      gradeLevels: ['High School', 'College'],
    },
    {
      id: '4',
      name: 'Sunita Gurung',
      avatar: 'https://picsum.photos/seed/sunita/300/300',
      subjects: ['English', 'Social Studies'],
      rating: 4.7,
      reviewCount: 22,
      price: 1000,
      location: 'Bhaktapur, Bagmati',
      experience: '4+ Years',
      bio: 'Certified IELTS trainer and English literature instructor. Focus on academic writing, fluency, and critical thinking.',
      availability: 'Available',
      gradeLevels: ['Elementary', 'Middle School', 'High School'],
    },
  ],
  bookings: [
    {
      id: 'b-1',
      tutorName: 'Rajesh Sharma',
      studentName: 'Alex Johnson',
      subject: 'Mathematics',
      date: 'Tomorrow',
      time: '10:00 AM',
      duration: '1 Hour',
      price: 1500,
      status: 'Upcoming',
      escrowStatus: 'Held',
      createdAt: new Date().toISOString(),
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      tutorId: '1',
      authorName: 'Sarah Jenkins',
      rating: 5,
      comment: 'Exceptional math instruction and clear calculus whiteboard notes!',
      date: '2 days ago',
    },
  ],
};

export class PersistentDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.load();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(fileContent);
      }
    } catch (err) {
      console.warn('Failed to read db.json, initializing defaults:', err);
    }
    this.save(DEFAULT_DB);
    return DEFAULT_DB;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write db.json:', err);
    }
  }

  // Users
  getUsers(): DBUser[] {
    return this.data.users;
  }

  findUserByEmail(email: string): DBUser | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): DBUser | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  addUser(user: DBUser) {
    this.data.users.push(user);
    this.save();
  }

  // Tutors
  getTutors() {
    return this.data.tutors;
  }

  findTutorById(id: string) {
    return this.data.tutors.find((t) => t.id === id);
  }

  // Bookings
  getBookings(): DBSession[] {
    return this.data.bookings;
  }

  addBooking(booking: DBSession) {
    this.data.bookings.unshift(booking);
    this.save();
  }

  updateBookingStatus(id: string, status: DBSession['status'], escrowStatus?: DBSession['escrowStatus']) {
    const booking = this.data.bookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
      if (escrowStatus) booking.escrowStatus = escrowStatus;
      this.save();
    }
    return booking;
  }

  // Reviews
  getReviews(tutorId?: string): DBReview[] {
    if (tutorId) {
      return this.data.reviews.filter((r) => r.tutorId === tutorId);
    }
    return this.data.reviews;
  }

  addReview(review: DBReview) {
    this.data.reviews.unshift(review);
    this.save();
  }
}

export const db = new PersistentDatabase();
