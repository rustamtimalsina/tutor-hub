import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  Book, 
  ArrowLeft, 
  Send, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  Award
} from 'lucide-react';
import BookingModal from '../components/BookingModal';
import { useApp } from '../context/AppContext';
import { sounds } from '../utils/soundEffects';

const TutorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tutors, isTutorSaved, toggleSaveTutor, reviews, addReview, currentUser } = useApp();
  
  const tutor = tutors.find((t) => t.id === id) || tutors[0];
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser?.name || 'Alex Johnson');

  const saved = isTutorSaved(tutor.id);

  // Tutor reviews from context
  const tutorReviews = reviews.filter((r) => r.tutorId === tutor.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    try { sounds.playSuccess(); } catch {}
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText('');
    }, 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview({
      tutorId: tutor.id,
      authorName: reviewAuthor.trim() || 'Verified Student',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      rating: ratingInput,
      comment: reviewComment.trim(),
    });

    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-transparent py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tutors
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden transition-colors">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="relative">
                  <img 
                    src={tutor.avatar} 
                    alt={tutor.name} 
                    className="w-28 h-28 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-lg ring-2 ring-slate-100 dark:ring-slate-700" 
                  />
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 sm:translate-x-0 sm:right-0 px-2.5 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    {tutor.availability}
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                      {tutor.name}
                      <ShieldCheck className="h-6 w-6 text-primary-600 dark:text-primary-400" title="Verified Educator" />
                    </h1>
                    <button
                      onClick={() => toggleSaveTutor(tutor.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all mx-auto sm:mx-0 ${
                        saved 
                          ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400' 
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${saved ? 'fill-current text-rose-500' : ''}`} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                      <Star className="h-4 w-4 text-amber-500 fill-current" />
                      <span className="text-xs font-black text-slate-900 dark:text-white">{tutor.rating}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({tutor.reviewCount + tutorReviews.length} reviews)</span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">•</span>
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{tutor.experience} Experience</span>
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-4">
                    {tutor.subjects.map((s) => (
                      <span key={s} className="px-3 py-1 bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 rounded-xl text-xs font-bold border border-primary-100 dark:border-primary-900/50">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      <span>{tutor.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary-600 dark:text-primary-400" /> About the Educator
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{tutor.bio}</p>
            </div>

            {/* Grade Levels Covered */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-500" /> Academic Levels Covered
              </h2>
              <div className="flex flex-wrap gap-2">
                {tutor.gradeLevels.map((gl) => (
                  <span key={gl} className="px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold">
                    {gl}
                  </span>
                ))}
              </div>
            </div>

            {/* Verified Student Reviews Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">Verified Student Feedback</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real feedback from 1-on-1 sessions</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewForm(!showReviewForm);
                    try { sounds.playClick(); } catch {}
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-primary-500/20"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {showReviewForm ? 'Cancel' : 'Write a Review'}
                </button>
              </div>

              {/* Interactive Write Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-primary-200 dark:border-primary-900/60 space-y-4 animate-in fade-in duration-200">
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Share Your Learning Experience
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Your Rating:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            setRatingInput(star);
                            try { sounds.playPop(); } catch {}
                          }}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              (hoverRating || ratingInput) >= star
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-xs font-black text-slate-700 dark:text-slate-300">
                        {ratingInput}.0 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="How did this tutor help you? Were the explanations clear?"
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/20"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {tutorReviews.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No reviews yet for this tutor. Be the first to leave one!
                  </div>
                ) : (
                  tutorReviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={rev.authorAvatar} 
                            alt={rev.authorName} 
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700" 
                          />
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">{rev.authorName}</span>
                            <span className="text-[10px] text-slate-400">{rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/40 text-amber-500 text-xs font-bold">
                          <Star className="h-3 w-3 fill-current" />
                          <span>{rev.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Interactive Send Message Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 transition-colors">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Send an Inquiry</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Have questions about syllabus coverage or schedule before booking?</p>
              
              {messageSent ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  Your inquiry was sent directly to {tutor.name}! You will receive a notification when they reply.
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <textarea 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs font-medium text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                    rows={3} 
                    placeholder={`Write a message to ${tutor.name}...`}
                    required
                  />
                  <button 
                    type="submit"
                    className="w-full py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex justify-center items-center gap-2 shadow-sm transition-all"
                  >
                    <Send className="h-4 w-4" /> Send Direct Inquiry
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-primary-200/80 dark:border-slate-800 p-6 sm:p-8 sticky top-24 space-y-6 transition-colors">
              <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Hourly Rate</span>
                <div className="text-4xl font-black text-primary-600 dark:text-primary-400 mt-1 tracking-tight">
                  NPR {tutor.price}
                </div>
                <span className="text-xs text-slate-400 font-medium">per 60-minute session</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>1-on-1 Interactive Video Classroom</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Live Whiteboard & Collaborative Notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  try { sounds.playClick(); } catch {}
                  setIsBookingOpen(true);
                }}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Book a Session Now
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                Khalti, eSewa & Card payments supported. Instant booking confirmation.
              </p>
            </div>
          </div>

        </div>
      </div>
      
      <BookingModal 
        tutor={tutor} 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </div>
  );
};

export default TutorProfile;
