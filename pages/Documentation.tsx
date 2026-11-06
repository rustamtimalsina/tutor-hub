import React, { useState } from 'react';
import { Book, Search, ChevronRight, Sparkles, Video, ShieldCheck, CreditCard, Bot, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Platform Overview', icon: Book },
    { id: 'classroom', title: '3D Virtual Classroom', icon: Video },
    { id: 'booking', title: 'Booking & Escrow Payments', icon: CreditCard },
    { id: 'ai', title: 'AI Study Copilot', icon: Bot },
    { id: 'faq', title: 'Frequently Asked Questions', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 pb-16 transition-colors duration-200">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 text-primary-200 border border-primary-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Documentation & Guides
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Tutor Hub Knowledge Center</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Learn how to search tutors, conduct live sessions, use the collaborative whiteboard, and handle secure payments.
            </p>
          </div>

          <Link
            to="/find-tutors"
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Find a Tutor Now →
          </Link>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Navigation Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-800 sticky top-24 space-y-2 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1">
                Table of Contents
              </span>
              
              <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isSelected = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0 text-left ${
                        isSelected
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="truncate">{sec.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Content Pane */}
          <main className="flex-1 space-y-6">
            
            {/* SECTION 1: Overview */}
            {activeSection === 'overview' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Platform Overview</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Tutor Hub is an interactive, personalized 1-on-1 tutoring platform built for high school and university students.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider">For Students</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Personalized Mentorship</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Search verified educators by subject, grade level, and budget. Book instant sessions with escrow protection and learn at your own pace.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">For Educators</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Teach & Earn</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      Manage incoming booking requests, host virtual sessions, set your own hourly rates, and receive verified digital wallet payouts.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: Virtual Classroom */}
            {activeSection === 'classroom' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">3D Virtual Classroom Guide</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    How to make the most of the live video classroom, drawing tools, and collaborative notes.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">1. High-DPI Whiteboard</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Equipped with quadratic Bézier curve smoothing for tablet styluses, multiple pen colors, thickness control, and 1-click PNG export.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">2. Hardware Video & Screen Share</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Toggle your real webcam or share your browser window for problem set reviews.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">3. In-Call AI Assistant</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ask the AI Copilot to break down theorems or generate practice questions on the fly without leaving the room.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/classroom/s1"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Test Live Classroom Now →
                  </Link>
                </div>
              </div>
            )}

            {/* SECTION 3: Booking & Payments */}
            {activeSection === 'booking' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Booking & Escrow Payments</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Transparent pricing in NPR with zero hidden commissions.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-center">
                    <h4 className="font-black text-purple-900 dark:text-purple-300 text-sm">Khalti Wallet</h4>
                    <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">Instant mobile wallet checkout</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
                    <h4 className="font-black text-emerald-900 dark:text-emerald-300 text-sm">eSewa Direct</h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Secure Nepali mobile banking</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-center">
                    <h4 className="font-black text-indigo-900 dark:text-indigo-300 text-sm">Visa & Mastercard</h4>
                    <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-1">International card payments</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 leading-relaxed flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Escrow Protection:</span> When you schedule a lesson, funds are locked in escrow. The tutor is only paid once the session has concluded successfully. You can cancel with a full refund up to 12 hours prior to the lesson.
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: AI Copilot */}
            {activeSection === 'ai' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">AI Study Copilot</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Your personal 24/7 academic assistant powered by state-of-the-art language models.
                  </p>
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">⚡ Step-by-Step Problem Solving:</span> Breaks down complex differential equations and physics derivations into bite-sized steps.
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">🎯 Practice Question Generator:</span> Generates tailor-made exam questions tailored to your current topic.
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white">📋 Automatic Lesson Summaries:</span> Consolidates main formulas and key takeaways after each lesson.
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: FAQs */}
            {activeSection === 'faq' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 transition-colors">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Frequently Asked Questions</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quick answers to common questions.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { q: 'How do I join my scheduled class?', a: 'Go to your Student Dashboard and tap "Join Live Classroom". You will immediately be connected to your mentor.' },
                    { q: 'Can I download the whiteboard notes after class?', a: 'Yes! Simply click "Save Notes" at the top of the classroom to download a high-resolution PNG of everything drawn during the session.' },
                    { q: 'Are tutors verified?', a: 'Every tutor undergoes background qualification checks and syllabus verification before their profile is marked Verified on Tutor Hub.' },
                  ].map((faq, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{faq.q}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
