import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, 
  PenTool, Eraser, RotateCcw, Download, MessageSquare, 
  FileText, Users, Sparkles, Send, CheckCircle2, Sliders,
  Bot, HelpCircle, Lightbulb, Compass, Play
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface Point {
  x: number;
  y: number;
}

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const Classroom: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { sessions, role } = useApp();

  const session = sessions.find((s) => s.id === sessionId) || {
    id: sessionId || 'demo',
    tutorName: 'Rajesh Sharma',
    subject: 'Mathematics',
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
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'ai'>('chat');
  const [reaction, setReaction] = useState<string | null>(null);

  // Real Webcam / Media Stream
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [hasWebcam, setHasWebcam] = useState(false);

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#7c3aed');
  const [penWidth, setPenWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [showThickness, setShowThickness] = useState(false);

  // Smooth drawing points buffer
  const pointsRef = useRef<Point[]>([]);

  // Chat messages
  const [chatMessages, setChatMessages] = useState([
    { sender: session.tutorName, text: "Welcome to today's session! Let's solve the theorem on the whiteboard.", time: '10:00 AM' },
    { sender: 'You', text: 'Hi! Ready to begin.', time: '10:01 AM' },
  ]);
  const [inputText, setInputText] = useState('');

  // AI Copilot State
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your AI Study Assistant for this ${session.subject} session. Ask me to break down formulas, generate practice questions, or explain tricky concepts in simple terms!`,
      time: '10:00 AM',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Shared Notes
  const [sharedNotes, setSharedNotes] = useState(
    "📝 Lesson Plan:\n1. Derivative of Composite Functions (Chain Rule)\n2. Implicit Differentiation\n3. Physics application: Velocity & Acceleration\n\nNotes from Tutor:\n- Recall that d/dx [f(g(x))] = f'(g(x)) * g'(x)"
  );

  // Timer & Join Call Sound
  const [secondsElapsed, setSecondsElapsed] = useState(35);
  useEffect(() => {
    // Play futuristic room entry sound
    sounds.playJoinCall();

    const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Real Camera Activation
  const toggleCamera = async () => {
    sounds.playToggle(!videoOn);
    if (videoOn && hasWebcam && localStream) {
      localStream.getVideoTracks().forEach((track) => track.stop());
      setLocalStream(null);
      setHasWebcam(false);
      setVideoOn(false);
    } else if (!videoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        setLocalStream(stream);
        setHasWebcam(true);
        setVideoOn(true);
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        // Fallback to avatar mode
        setVideoOn(true);
        setHasWebcam(false);
      }
    } else {
      setVideoOn(false);
    }
  };

  const toggleScreenShare = async () => {
    sounds.playToggle(!screenSharing);
    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenSharing(true);
        displayStream.getVideoTracks()[0].onended = () => {
          setScreenSharing(false);
        };
      } catch {
        setScreenSharing(false);
      }
    } else {
      setScreenSharing(false);
    }
  };

  // High-DPI Grid Drawing
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    drawGrid(ctx, rect.width, rect.height);
  }, [drawGrid]);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCoordinates(e);
    if (!pt) return;

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDrawing(true);
    pointsRef.current = [pt];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (isEraser ? penWidth * 3 : penWidth) / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#ffffff' : penColor;
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pt = getCoordinates(e);
    if (!pt) return;

    pointsRef.current.push(pt);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pts = pointsRef.current;
    if (pts.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 5 : penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    ctx.stroke();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    setIsDrawing(false);
    pointsRef.current = [];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGrid(ctx, rect.width, rect.height);
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
    sounds.playClick();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);
    setInputText('');
  };

  // AI Copilot Generator
  const handleAskAI = (promptText?: string) => {
    const query = promptText || aiInput;
    if (!query.trim()) return;

    sounds.playClick();

    const userMsg: AIMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let response = '';
      const lower = query.toLowerCase();

      if (lower.includes('chain rule') || lower.includes('derivative')) {
        response = `💡 **Chain Rule Breakdown:**\nIf $y = f(g(x))$, then $\\frac{dy}{dx} = f'(g(x)) \\cdot g'(x)$.\n\n**Example:** To differentiate $\\sin(3x^2)$:\n1. Outer function: $f(u) = \\sin(u) \\rightarrow f'(u) = \\cos(u)$\n2. Inner function: $g(x) = 3x^2 \\rightarrow g'(x) = 6x$\n3. Result: $6x \\cdot \\cos(3x^2)$.`;
      } else if (lower.includes('question') || lower.includes('practice') || lower.includes('quiz')) {
        response = `📝 **Quick Practice Challenge:**\nFind the derivative of $f(x) = (4x^3 - 2x)^5$.\n\n*Hint:* Apply the power rule to the outside bracket first, then multiply by the derivative of the inside polynomial! Try working it out on your whiteboard!`;
      } else if (lower.includes('summary') || lower.includes('takeaway')) {
        response = `🎯 **Session Key Takeaways:**\n- Always identify the "outer" and "inner" functions before differentiating.\n- Don't forget the negative sign when differentiating cosine: $\\frac{d}{dx}[\\cos(x)] = -\\sin(x)$.\n- Verify critical points where $f'(x) = 0$ for local maxima/minima.`;
      } else {
        response = `Great question on ${session.subject}! Remember to check dimensional units and break complex problems into 2-step modular equations. Ask your mentor ${session.tutorName} to sketch the graph on the whiteboard!`;
      }

      sounds.playMessage();

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setAiLoading(false);
    }, 700);
  };

  const triggerReaction = (emoji: string) => {
    sounds.playPop();
    setReaction(emoji);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch {}
    setTimeout(() => setReaction(null), 2500);
  };

  const handleEndSession = () => {
    sounds.playLeaveCall();
    const targetDashboard = role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard';
    navigate(targetDashboard);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl shadow-md shadow-primary-500/20">
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
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          {/* Quick AI Toggle in Header */}
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === 'ai'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 scale-105'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Bot className="h-4 w-4 text-amber-400" />
            <span>AI Copilot ✨</span>
          </button>
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

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Video Feeds & Canvas */}
        <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          
          {/* Video Feeds Grid */}
          <div className="h-44 grid grid-cols-2 gap-4">
            
            {/* Tutor Video */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg">
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

            {/* Student Video (Real Camera or Avatar) */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative shadow-lg flex items-center justify-center">
              {hasWebcam && videoOn ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : videoOn ? (
                <div className="w-full h-full bg-gradient-to-tr from-slate-900 to-indigo-950 flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-2">
                    A
                  </div>
                  <span className="text-xs font-bold text-slate-300">Alex Johnson (You)</span>
                  <span className="text-[10px] text-slate-400 mt-1">Camera enabled</span>
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
              
              {/* Palette */}
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
                <div className="relative">
                  <button
                    onClick={() => setShowThickness(!showThickness)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Stroke Width"
                  >
                    <Sliders className="h-4 w-4" />
                  </button>
                  {showThickness && (
                    <div className="absolute top-12 -left-6 bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-xl w-36 z-30">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">Thickness: {penWidth}px</span>
                      <input 
                        type="range" 
                        min="2" 
                        max="16" 
                        value={penWidth} 
                        onChange={(e) => setPenWidth(Number(e.target.value))}
                        className="w-full accent-primary-500 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
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

            {/* High-DPI Smooth HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full cursor-crosshair touch-none"
            />
          </div>

          {/* Bottom Call Controls */}
          <div className="h-16 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-slate-800 px-6 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                sounds.playToggle(!micOn);
                setMicOn(!micOn);
              }}
              className={`p-3 rounded-2xl transition-all ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-3 rounded-2xl transition-all ${
                videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              }`}
              title={videoOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {videoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </button>
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-2xl transition-all ${
                screenSharing ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Share Screen"
            >
              <ScreenShare className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Right Sidebar: Chat, Notes & AI Copilot */}
        <aside className="w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col">
          
          {/* Tabs */}
          <div className="p-3 border-b border-slate-800 flex gap-1.5">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'chat' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'notes' ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Notes
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-all ${
                activeTab === 'ai' ? 'bg-gradient-to-r from-amber-500 to-primary-600 text-white shadow-md' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <Bot className="h-3.5 w-3.5" /> AI Copilot
            </button>
          </div>

          {/* TAB 1: Live Chat */}
          {activeTab === 'chat' && (
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
          )}

          {/* TAB 2: Notes */}
          {activeTab === 'notes' && (
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

          {/* TAB 3: AI Copilot */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between p-4 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                
                {/* Quick Prompts */}
                <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Quick AI Prompts
                  </span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleAskAI('Explain chain rule step-by-step with an example')}
                      className="text-left text-[11px] p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    >
                      ⚡ Explain Chain Rule with example
                    </button>
                    <button
                      onClick={() => handleAskAI('Generate 1 practice calculus question')}
                      className="text-left text-[11px] p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    >
                      🎯 Give me a practice question
                    </button>
                    <button
                      onClick={() => handleAskAI('Summarize key takeaways for this topic')}
                      className="text-left text-[11px] p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    >
                      📋 Summarize key takeaways
                    </button>
                  </div>
                </div>

                {/* AI Chat History */}
                {aiMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-500 font-semibold mb-1 flex items-center gap-1">
                      {msg.role === 'user' ? 'You' : <><Bot className="h-3 w-3 text-amber-400" /> AI Copilot</>} • {msg.time}
                    </span>
                    <div
                      className={`p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white font-medium rounded-tr-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-amber-400 p-2">
                    <Sparkles className="h-4 w-4 animate-spin" />
                    <span>AI Copilot is solving...</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Ask AI Copilot anything..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAskAI()}
                  className="p-2.5 bg-gradient-to-r from-amber-500 to-primary-600 hover:opacity-90 text-white rounded-xl shadow-md transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

        </aside>

      </div>

    </div>
  );
};

export default Classroom;
