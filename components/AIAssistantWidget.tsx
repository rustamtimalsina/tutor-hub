import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, MessageSquare, BookOpen, HelpCircle, ArrowRight, Video } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sounds } from '../utils/soundEffects';

interface AIMsg {
  role: 'user' | 'assistant';
  text: string;
}

const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // If inside the classroom, classroom already has its integrated sidebar, so hide floating widget
  if (location.pathname.startsWith('/classroom')) {
    return null;
  }

  const [messages, setMessages] = useState<AIMsg[]>([
    {
      role: 'assistant',
      text: "👋 Hi! I'm your Tutor Hub AI Assistant. Looking for the best math tutor, need help with homework, or want to test our live 3D classroom?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLaunchClassroom = () => {
    sounds.playJoinCall();
    setIsOpen(false);
    navigate('/classroom/s1');
  };

  const handleSend = (userQuery?: string) => {
    const q = userQuery || input;
    if (!q.trim()) return;

    sounds.playClick();
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('classroom') || lower.includes('demo') || lower.includes('whiteboard') || lower.includes('video')) {
        reply = "🚀 Live 1-on-1 Classroom is ready! It includes the interactive whiteboard, dual video feeds, and in-call AI tutor. Click the button below to jump straight into the room:";
      } else if (lower.includes('math') || lower.includes('calculus') || lower.includes('physics')) {
        reply = "🎯 For Mathematics & Physics, Rajesh Sharma (M.Sc., 8+ yrs experience, 4.9⭐ rating) is our top-rated mentor at NPR 1,500/hr. You can book him directly with Khalti or eSewa!";
      } else if (lower.includes('computer') || lower.includes('code') || lower.includes('python')) {
        reply = "💻 Bikash Adhikari specializes in Computer Science, Python, and Web Development with a perfect 5.0⭐ rating!";
      } else if (lower.includes('payment') || lower.includes('esewa') || lower.includes('khalti')) {
        reply = "💳 We support instant Khalti, eSewa, and International Credit Card payments with secure escrow protection until your lesson completes!";
      } else {
        reply = `I can help you match with verified educators, explain study syllabuses, or guide you into the live interactive classroom! What subject are you preparing for?`;
      }

      sounds.playMessage();
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 500);
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
        <div className="bg-slate-950 text-white rounded-3xl w-[calc(100vw-2rem)] max-w-[420px] h-[520px] max-h-[85vh] shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 via-indigo-950 to-slate-950 px-4 sm:px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-gradient-to-tr from-amber-400 to-primary-600 rounded-2xl text-slate-950 shadow-md">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <h3 className="font-black text-xs sm:text-sm text-white flex items-center gap-1.5">
                  Tutor Hub AI Copilot
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">GPT</span>
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Available 24/7 across the platform</p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 text-xs">
            {/* Quick Actions */}
            <div className="space-y-1.5 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
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
                  onClick={() => handleSend('Who is the best tutor for Calculus?')}
                  className="text-left p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-slate-300 text-[11px] transition-colors"
                >
                  📐 Who is the best tutor for Calculus?
                </button>
                <button
                  onClick={() => handleSend('How does payment and escrow work?')}
                  className="text-left p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-slate-300 text-[11px] transition-colors"
                >
                  💳 How does Khalti/eSewa payment work?
                </button>
              </div>
            </div>

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  
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
              <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask AI Copilot anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-primary-600 text-white rounded-xl shadow-md hover:opacity-90 transition-opacity"
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
