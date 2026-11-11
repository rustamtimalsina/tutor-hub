import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, MessageSquare, BookOpen, HelpCircle, ArrowRight, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sounds } from '../utils/soundEffects';
import { api } from '../services/api';
import MathMarkdown from './MathMarkdown';

interface AIMsg {
  role: 'user' | 'assistant';
  text: string;
}

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<AIMsg[]>([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your Tutor Hub AI Assistant. Looking for the best math tutor, need help with homework, or want to test our live 3D classroom?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // If inside the classroom, classroom already has its integrated sidebar, so hide floating widget
  // (Safe after all hook declarations)
  if (location.pathname.startsWith('/classroom')) {
    return null;
  }

  const handleLaunchClassroom = () => {
    sounds.playJoinCall();
    setIsOpen(false);
    navigate('/classroom/s1');
  };

  const handleSend = async (userQuery?: string) => {
    const q = userQuery || input;
    if (!q.trim()) return;

    try { sounds.playClick(); } catch {}
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const lower = q.toLowerCase();
      let reply = '';
      if (lower.includes('launch classroom') || lower.includes('open classroom')) {
        reply = "🚀 Live 1-on-1 Classroom is ready! It includes the interactive whiteboard, real WebRTC video feeds, and in-call Gemini AI tutor. Click the button below to jump straight into the room:";
      } else {
        reply = await api.askCopilot(q, 'General STEM & Mentorship', undefined, messages);
      }

      try { sounds.playMessage(); } catch {}
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: "I'm ready to help you find verified mentors or test our live 3D classroom!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            sounds.playClick();
            setIsOpen(true);
          }}
          className="group relative flex items-center gap-2.5 sm:gap-3 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 text-white rounded-full shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 transition-all border border-white/20"
        >
          <div className="p-1 sm:p-1.5 bg-white/20 rounded-full">
            <Bot className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black uppercase tracking-wider text-amber-300">Tutor AI Copilot</span>
            <span className="text-[11px] text-slate-200">Ask anything or match tutors</span>
          </div>
          <span className="block sm:hidden text-xs font-bold text-white pr-1">AI Copilot</span>
          <span className="h-3 w-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-white" />
        </button>
      )}

      {/* Slide-Up AI Drawer with 100% Mobile Viewport Protection */}
      {isOpen && (
        <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-slate-900 dark:text-white rounded-3xl w-[calc(100vw-2rem)] max-w-[420px] h-[540px] max-h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-indigo-700 to-purple-800 px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-amber-400 to-primary-500 rounded-2xl text-slate-950 shadow-md">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  Tutor Hub AI Copilot
                  <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">Gemini</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white/75">STEM Solver & Smart Tutor Match</p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setIsOpen(false);
              }}
              className="text-white/70 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 text-xs">
            {/* Quick Actions */}
            <div className="space-y-1.5 bg-slate-50 dark:bg-slate-900/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Quick Launch & Inquiries
              </span>
              <div className="flex flex-col gap-1.5">
                {/* Instant 1-Click Launch Button */}
                <button
                  onClick={handleLaunchClassroom}
                  className="w-full text-left p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center justify-between hover:scale-[1.01]"
                >
                  <span className="flex items-center gap-2">
                    <Video className="h-4 w-4" /> 🚀 Launch Live Classroom Demo
                  </span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handleSend('Solve ∫ x * e^x dx step by step using integration by parts')}
                  className="text-left p-2 bg-white hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/70 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                >
                  📐 Solve ∫ x·eˣ dx step-by-step (KaTeX)
                </button>
                <button
                  onClick={() => handleSend('How does Khalti and eSewa escrow payment work?')}
                  className="text-left p-2 bg-white hover:bg-slate-100 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 border border-slate-200/70 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors"
                >
                  💳 How does Khalti/eSewa escrow work?
                </button>
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[92%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none font-medium shadow-md'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  <MathMarkdown content={m.text} className="text-xs" />
                  
                  {(m.text.includes('Live 1-on-1 Classroom') || m.text.includes('virtual classroom')) && (
                    <button
                      onClick={handleLaunchClassroom}
                      className="mt-3 w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg hover:opacity-90 flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                      <Video className="h-4 w-4" /> Enter Live Classroom Now →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 p-2 font-semibold">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>Gemini AI is solving...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask Gemini AI any math, physics, or coding question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-primary-600 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default AIAssistantWidget;
