import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json());

// In-Memory Data Store (Easily connectable to PostgreSQL / MongoDB)
let tutors = [
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
];

let bookings: any[] = [
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
  },
];

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Tutor Hub 3D API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Tutors Endpoints
app.get('/api/tutors', (req: Request, res: Response) => {
  const { subject, maxPrice, minRating } = req.query;
  let results = [...tutors];

  if (subject && subject !== 'All subjects') {
    results = results.filter((t) =>
      t.subjects.some((s) => s.toLowerCase() === String(subject).toLowerCase())
    );
  }
  if (maxPrice) {
    results = results.filter((t) => t.price <= Number(maxPrice));
  }
  if (minRating) {
    results = results.filter((t) => t.rating >= Number(minRating));
  }

  res.json({ count: results.length, data: results });
});

app.get('/api/tutors/:id', (req: Request, res: Response) => {
  const tutor = tutors.find((t) => t.id === req.params.id);
  if (!tutor) {
    return res.status(404).json({ error: 'Tutor not found' });
  }
  res.json({ data: tutor });
});

// Bookings Endpoints
app.get('/api/bookings', (_req: Request, res: Response) => {
  res.json({ data: bookings });
});

app.post('/api/bookings', (req: Request, res: Response) => {
  const { tutorName, studentName, subject, date, time, duration, price } = req.body;
  if (!tutorName || !subject || !date || !time) {
    return res.status(400).json({ error: 'Missing required booking details' });
  }

  const newBooking = {
    id: `book-${Date.now()}`,
    tutorName,
    studentName: studentName || 'Alex Johnson',
    subject,
    date,
    time,
    duration: duration || '1 Hour',
    price: price || 1500,
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
  };

  bookings.unshift(newBooking);
  res.status(201).json({ message: 'Booking confirmed', data: newBooking });
});

// Authentication Mock Endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, role } = req.body;
  res.json({
    message: 'Login successful',
    token: `jwt-token-${Date.now()}`,
    user: {
      id: 'usr-101',
      email: email || 'alex@example.com',
      role: role || 'student',
      name: role === 'tutor' ? 'Rajesh Sharma' : 'Alex Johnson',
    },
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tutor Hub API running on http://localhost:${PORT}`);
});
