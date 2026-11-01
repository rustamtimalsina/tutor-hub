import React, { useState } from 'react';
import { Bot, X, Sparkles, Send, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

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

  const handleSend = (userQuery?: string) => {
    const q = userQuery || input;
    if (!q.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('classroom') || lower.includes('demo') || lower.includes('whiteboard')) {
        reply = "🚀 You can launch our live 1-on-1 virtual classroom with the interactive whiteboard and video call right now! Click below to jump straight in:";
      } else if (lower.includes('math') || lower.includes('calculus') || lower.includes('physics')) {
        reply = "🎯 For Mathematics & Physics, Rajesh Sharma (M.Sc., 8+ yrs experience, 4.9⭐ rating) is our top-rated mentor at NPR 1,500/hr. You can book him directly with Khalti or eSewa!";
      } else if (lower.includes('computer') || lower.includes('code') || lower.includes('python')) {
        reply = "💻 Bikash Adhikari specializes in Computer Science, Python, and Web Development with a perfect 5.0⭐ rating!";
      } else {
        reply = `I can help you match with verified educators, explain study syllabuses, or guide you into the live interactive classroom! What subject are you preparing for?`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-600 text-white rounded-full shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:scale-105 transition-all border border-white/20"
        >
          <div className="p-1.5 bg-white/20 rounded-full">
            <Bot className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-black uppercase tracking-wider text-amber-300">Tutor AI Copilot</span>
            <span className="text-[11px] text-slate-200">Ask anything or match tutors</span>
          </div>
          <span className="h-3 w-3 rounded-full bg-emerald-400 absolute -top-1 -right-1 ring-2 ring-white" />
        </button>
      )}

      {/* Slide-Up AI Drawer */}
      {isOpen && (
        <div className="bg-slate-950 text-white rounded-3xl w-[360px] sm:w-[400px] h-[520px] shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-900 via-indigo-950 to-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-amber-400 to-primary-600 rounded-2xl text-slate-950 shadow-md">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  Tutor Hub AI Copilot
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">GPT</span>
                </h3>
                <p className="text-[11px] text-slate-400">Available 24/7 across the platform</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {/* Quick Actions */}
            <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Quick Questions
              </span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleSend('Take me to the Live Classroom demo')}
                  className="text-left p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-[11px] transition-colors"
                >
                  🚀 Launch Live Classroom demo
                </button>
                <button
                  onClick={() => handleSend('Who is the best tutor for Calculus?')}
                  className="text-left p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-[11px] transition-colors"
                >
                  📐 Who is the best tutor for Calculus?
                </button>
                <button
                  onClick={() => handleSend('How does payment and escrow work?')}
                  className="text-left p-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-[11px] transition-colors"
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
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                  
                  {m.text.includes('live 1-on-1 virtual classroom') && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/classroom/s1');
                      }}
                      className="mt-2.5 w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-90 flex items-center justify-center gap-1.5"
                    >
                      Enter Live Classroom Now →
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
              placeholder="Ask anything..."
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
