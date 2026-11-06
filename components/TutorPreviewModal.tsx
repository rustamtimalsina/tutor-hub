import React, { useEffect } from 'react';
import { X, Star, ShieldCheck, Video, MapPin, Award, CheckCircle2, Calendar, Sparkles, MessageSquare } from 'lucide-react';
import { Tutor } from '../types';
import { sounds } from '../utils/soundEffects';

interface TutorPreviewModalProps {
  tutor: Tutor | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (tutor: Tutor) => void;
}

export const TutorPreviewModal: React.FC<TutorPreviewModalProps> = ({
  tutor,
  isOpen,
  onClose,
  onBook,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !tutor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 my-auto text-slate-800 dark:text-slate-100 transition-all">
        {/* Top Header Background Banner */}
        <div className="h-32 sm:h-36 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 relative p-4 flex justify-between items-start">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Verified Mentor Profile
          </div>
          <button
            onClick={() => {
              try { sounds.playClick(); } catch {}
              onClose();
            }}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 -mt-14 sm:-mt-16 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="relative">
                <img
                  src={tutor.avatar}
                  alt={tutor.name}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl ring-2 ring-primary-500/30"
                />
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 ring-2 ring-emerald-400/40 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {tutor.name}
                  <CheckCircle2 className="h-5 w-5 text-primary-500 fill-primary-100 dark:fill-primary-950" />
                </h3>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-semibold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" /> {tutor.rating}
                  </span>
                  <span>•</span>
                  <span>{tutor.reviewCount} student reviews</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Nepal
                  </span>
                </div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="text-center sm:text-right bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-700">
              <div className="text-2xl font-black text-primary-600 dark:text-primary-400">
                NPR {tutor.price}
              </div>
              <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center sm:justify-end gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Escrow Protected
              </div>
            </div>
          </div>

          {/* Interactive Video Preview Mockup */}
          <div className="mt-5 rounded-2xl bg-slate-950 text-white p-4 relative overflow-hidden border border-slate-800 shadow-lg group">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-300">
              <span className="flex items-center gap-2 font-bold">
                <Video className="h-4 w-4 text-primary-400" /> 60-Sec Intro Video & Whiteboard Demo
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                Active Mentor
              </span>
            </div>
            
            <div className="h-28 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 via-indigo-900/20 to-transparent pointer-events-none" />
              <div className="h-10 w-10 rounded-full bg-primary-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <svg className="h-5 w-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span className="text-[11px] text-slate-300 font-medium mt-2">
                Click to preview teaching style & interactive whiteboard
              </span>
            </div>
          </div>

          {/* Subjects and Bio */}
          <div className="mt-5 space-y-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Expertise & Subjects</h4>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((sub) => (
                  <span
                    key={sub}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-primary-50 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">About Tutor</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {tutor.bio}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onBook(tutor);
              }}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-primary-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Calendar className="h-4 w-4" /> Book Live 1-on-1 Session (NPR {tutor.price})
            </button>
            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorPreviewModal;
