import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, 
  PenTool, Eraser, RotateCcw, Download, MessageSquare, 
  FileText, Users, Sparkles, Send, CheckCircle2, Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const Classroom: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, role } = useApp();

  const session = sessions.find((s) => s.id === sessionId) || {
    id: sessionId || 'demo',
    tutorName: 'Rajesh Sharma',
    subject: 'Calculus & Physics',
    date: 'Today',
    time: 'Live Now',
    duration: '1 Hour',
    price: 1500,
    status: 'Upcoming' as const,
  };

  // Video & Audio Controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');
  const [reaction, setReaction] = useState<string | null>(null);

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#7c3aed');
  const [penWidth, setPenWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    { sender: session.tutorName, text: "Welcome to today's session! Let's solve the theorem on the whiteboard.", time: '10:00 AM' },
    { sender: 'You', text: 'Hi! Ready to begin.', time: '10:01 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  // Shared Notes
  const [sharedNotes, setSharedNotes] = useState(
    "📝 Lesson Plan:\n1. Derivative of Composite Functions (Chain Rule)\n2. Implicit Differentiation\n3. Physics application: Velocity & Acceleration\n\nNotes from Tutor:\n- Recall that d/dx [f(g(x))] = f'(g(x)) * g'(x)"
  );

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Canvas Drawing Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Resize canvas to match display size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Initial grid pattern on whiteboard
    drawGrid(ctx, canvas.width, canvas.height);
  }, []);

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 5 : penWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawGrid(ctx, canvas.width, canvas.height);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `tutor-hub-notes-${session.subject}.png`;
    link.href = url;
    link.click();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInputText('');
  };

  const triggerReaction = (emoji: string) => {
    setReaction(emoji);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setReaction(null), 2500);
  };

  const handleEndSession = () => {
    const targetDashboard = role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
    navigate(targetDashboard);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden">
      
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-600 rounded-xl">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm text-white flex items-center gap-2">
              {session.subject} Classroom
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Live HD
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Mentor: {session.tutorName}</p>
          </div>
        </div>

        {/* Live Session Timer */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 shadow-inner">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={downloadCanvas}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
            title="Download Whiteboard"
          >
            <Download className="h-4 w-4" /> Save Notes
          </button>
          <button
            onClick={handleEndSession}
            className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <PhoneOff className="h-4 w-4" /> End Call
          </button>
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Interactive Canvas & Video Feeds */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          
          {/* Top Video Tiles */}
          <div className="h-44 grid grid-cols-2 gap-4">
            {/* Tutor Video Tile */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg group">
              <img
                src="https://picsum.photos/seed/rajesh/600/400"
                alt="Tutor Feed"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {session.tutorName} (Tutor)
              </div>
              {reaction && (
                <div className="absolute top-4 right-4 text-4xl animate-bounce">
                  {reaction}
                </div>
              )}
            </div>

            {/* Student Video Tile */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg flex items-center justify-center">
              {videoOn ? (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-2">
                    A
                  </div>
                  <span className="text-xs font-bold text-slate-300">Alex Johnson (You)</span>
                </div>
              ) : (
                <div className="text-center text-slate-500 text-xs">
                  <VideoOff className="h-8 w-8 mx-auto mb-1 text-slate-600" />
                  Camera is turned off
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-white flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${micOn ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                You {micOn ? '' : '(Muted)'}
              </div>
            </div>
          </div>

          {/* Whiteboard Canvas Container */}
          <div className="flex-1 bg-white rounded-3xl overflow-hidden relative border border-slate-800 shadow-2xl flex flex-col">
            
            {/* Whiteboard Floating Toolbar */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl flex items-center gap-3">
              
              {/* Pen Color Presets */}
              <div className="flex items-center gap-1.5 pr-3 border-r border-slate-700">
                {['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#0f172a'].map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setPenColor(c);
                      setIsEraser(false);
                    }}
                    style={{ backgroundColor: c }}
                    className={`h-5 w-5 rounded-full transition-transform ${
                      penColor === c && !isEraser ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>

              {/* Tools */}
              <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
                <button
                  onClick={() => setIsEraser(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    !isEraser ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Draw Pen"
                >
                  <PenTool className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsEraser(true)}
                  className={`p-2 rounded-xl transition-colors ${
                    isEraser ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Eraser"
                >
                  <Eraser className="h-4 w-4" />
                </button>
                <button
                  onClick={clearCanvas}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Clear Whiteboard"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Reactions */}
              <div className="flex items-center gap-1">
                {['👍', '💡', '🔥', '👏'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerReaction(emoji)}
                    className="p-1 hover:scale-125 transition-transform text-sm"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

            </div>

            {/* The Drawing Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair"
            />
          </div>

          {/* Bottom Call Controls Bar */}
          <div className="h-16 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 px-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-3 rounded-2xl transition-all ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-3 rounded-2xl transition-all ${
                videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={videoOn ? 'Turn Video Off' : 'Turn Video On'}
            >
              {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-3 rounded-2xl transition-all ${
                screenSharing ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Share Screen"
            >
              <ScreenShare className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Right Sidebar: Chat & Notes */}
        <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col">
          
          {/* Tab Switcher */}
          <div className="p-3 border-b border-slate-800 flex gap-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'chat' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-4 w-4" /> Live Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'notes' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" /> Shared Notes
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'chat' ? (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 font-semibold mb-1">
                      {msg.sender} • {msg.time}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                        msg.sender === 'You'
                          ? 'bg-primary-600 text-white font-medium rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <span className="text-[11px] text-slate-400 font-bold mb-2">Live Collaborative Notepad:</span>
              <textarea
                value={sharedNotes}
                onChange={(e) => setSharedNotes(e.target.value)}
                className="flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none leading-relaxed"
                placeholder="Type real-time study notes here..."
              />
              <span className="text-[10px] text-slate-500 mt-2">Changes are synchronized live with the educator.</span>
            </div>
          )}

        </aside>

      </div>

    </div>
  );
};

export default Classroom;
