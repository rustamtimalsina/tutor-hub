import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, 
  PenTool, Eraser, RotateCcw, Download, MessageSquare, 
  FileText, Users, Sparkles, Send, CheckCircle2, Sliders,
  Bot, HelpCircle, Lightbulb, Compass, Play, Layout, MessageCircle,
  Wifi, WifiOff, Star, ShieldCheck, Award, X
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useApp } from '../context/AppContext';
import { api, SERVER_URL } from '../services/api';
import MathMarkdown from '../components/MathMarkdown';
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
  const { sessions, role, currentUser } = useApp();

  const session = (Array.isArray(sessions) ? sessions.find((s) => s && s.id === sessionId) : null) || {
    id: sessionId || 's1',
    tutorName: 'Rajesh Sharma',
    subject: 'Mathematics',
    date: 'Today',
    time: '10:00 AM',
    duration: '1 Hour',
    price: 1500,
    status: 'Upcoming' as const,
  };

  // Mobile View Switcher (canvas vs sidebar)
  const [mobileTab, setMobileTab] = useState<'canvas' | 'chat'>('canvas');

  // Video & Audio Controls
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes' | 'ai'>('chat');
  const [reaction, setReaction] = useState<string | null>(null);

  // Real Webcam / WebRTC Media Streams
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [remotePeerName, setRemotePeerName] = useState<string | null>(null);
  const [remoteMediaState, setRemoteMediaState] = useState<{ micOn: boolean; videoOn: boolean }>({
    micOn: true,
    videoOn: true,
  });
  const [hasWebcam, setHasWebcam] = useState(false);

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#7c3aed');
  const [penWidth, setPenWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [showThickness, setShowThickness] = useState(false);

  // Socket.io Real-Time Connection
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activePeers, setActivePeers] = useState<number>(1);

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
      content: `Hello! I'm your **Gemini AI Study Assistant** for this ${session.subject} session. Ask me to derive formulas, solve calculus or physics problems, or generate practice questions!`,
      time: '10:00 AM',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Shared Notes
  const [sharedNotes, setSharedNotes] = useState(
    "📝 Lesson Plan:\n1. Derivative of Composite Functions (Chain Rule)\n2. Implicit Differentiation\n3. Physics application: Velocity & Acceleration\n\nNotes from Tutor:\n- Recall that d/dx [f(g(x))] = f'(g(x)) * g'(x)"
  );

  // Post-Session Completion & Escrow Release Modal
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Excellent session! The interactive 3D whiteboard and step-by-step calculus explanations made everything clear.');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Timer
  const [secondsElapsed, setSecondsElapsed] = useState(35);
  useEffect(() => {
    const timer = setInterval(() => setSecondsElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sync video element refs whenever streams change
  useEffect(() => {
    if (userVideoRef.current && localStream) {
      userVideoRef.current.srcObject = localStream;
    }
  }, [localStream, videoOn, hasWebcam]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Renegotiate local stream across all connected WebRTC peers
  const attachStreamToPeersAndRenegotiate = useCallback(async (stream: MediaStream) => {
    const myName = currentUser?.name || (role === 'tutor' ? 'Rajesh Sharma' : 'Alex Johnson');
    for (const [peerId, pc] of peerConnectionsRef.current.entries()) {
      const existingSenders = pc.getSenders();
      stream.getTracks().forEach((track) => {
        const matchingSender = existingSenders.find((s) => s.track && s.track.kind === track.kind);
        if (matchingSender) {
          matchingSender.replaceTrack(track);
        } else {
          pc.addTrack(track, stream);
        }
      });
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit('webrtc-offer', {
          to: peerId,
          offer,
          userName: myName,
          role: role || 'student',
        });
      } catch (err) {
        console.warn('WebRTC renegotiation warning:', err);
      }
    }
  }, [currentUser, role]);

  // Real Camera + Mic Activation with WebRTC Renegotiation
  const toggleCamera = async () => {
    try { sounds.playToggle(!videoOn); } catch {}
    if (videoOn && hasWebcam && localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
      setHasWebcam(false);
      setVideoOn(false);
      socketRef.current?.emit('webrtc-media-state', { micOn, videoOn: false });
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        localStreamRef.current = stream;
        setLocalStream(stream);
        setHasWebcam(true);
        setVideoOn(true);
        socketRef.current?.emit('webrtc-media-state', { micOn, videoOn: true });
        await attachStreamToPeersAndRenegotiate(stream);
      } catch {
        setVideoOn(false);
        setHasWebcam(false);
      }
    }
  };

  const toggleMic = () => {
    const nextMic = !micOn;
    try { sounds.playToggle(nextMic); } catch {}
    setMicOn(nextMic);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = nextMic;
      });
    }
    socketRef.current?.emit('webrtc-media-state', { micOn: nextMic, videoOn });
  };

  const toggleScreenShare = async () => {
    try { sounds.playToggle(!screenSharing); } catch {}
    if (!screenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = displayStream;
        setScreenSharing(true);
        setHasWebcam(true);
        setVideoOn(true);
        setLocalStream(displayStream);
        await attachStreamToPeersAndRenegotiate(displayStream);

        displayStream.getVideoTracks()[0].onended = async () => {
          setScreenSharing(false);
          screenStreamRef.current = null;
          if (localStreamRef.current) {
            setLocalStream(localStreamRef.current);
            await attachStreamToPeersAndRenegotiate(localStreamRef.current);
          } else {
            setLocalStream(null);
            setHasWebcam(false);
            setVideoOn(false);
          }
        };
      } catch {
        setScreenSharing(false);
      }
    } else {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      setScreenSharing(false);
      if (localStreamRef.current) {
        setLocalStream(localStreamRef.current);
        await attachStreamToPeersAndRenegotiate(localStreamRef.current);
      } else {
        setLocalStream(null);
        setHasWebcam(false);
        setVideoOn(false);
      }
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
  }, [drawGrid, mobileTab]);

  // ----------------------------------------------------
  // Real-Time Socket.io + WebRTC Signaling Connection
  // ----------------------------------------------------
  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });
    socketRef.current = socket;

    const myName = currentUser?.name || (role === 'tutor' ? 'Rajesh Sharma' : 'Alex Johnson');

    const getOrCreatePeerConnection = (peerId: string, peerLabel?: string) => {
      const existing = peerConnectionsRef.current.get(peerId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Attach local camera/screen tracks if already enabled
      const activeOutStream = screenStreamRef.current || localStreamRef.current;
      if (activeOutStream) {
        activeOutStream.getTracks().forEach((track) => pc.addTrack(track, activeOutStream));
      }

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('webrtc-ice-candidate', {
            to: peerId,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStream(event.streams[0]);
          if (peerLabel) setRemotePeerName(peerLabel);
        }
      };

      peerConnectionsRef.current.set(peerId, pc);
      return pc;
    };

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join-room', {
        roomId: sessionId || 's1',
        userName: myName,
        role: role || 'student',
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // When joining an active room, initiate WebRTC offers to existing peers
    socket.on('room-peers', async (peers: Array<{ socketId: string; userName: string; role: string }>) => {
      setActivePeers(peers.length + 1);
      for (const peer of peers) {
        setRemotePeerName(`${peer.userName} (${peer.role})`);
        const pc = getOrCreatePeerConnection(peer.socketId, `${peer.userName} (${peer.role})`);
        try {
          const offer = await pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
          await pc.setLocalDescription(offer);
          socket.emit('webrtc-offer', {
            to: peer.socketId,
            offer,
            userName: myName,
            role: role || 'student',
          });
        } catch (err) {
          console.warn('WebRTC initial offer error:', err);
        }
      }
    });

    socket.on('user-joined', (peer) => {
      setActivePeers((prev) => prev + 1);
      setRemotePeerName(`${peer.userName} (${peer.role})`);
      setChatMessages((prev) => [
        ...prev,
        { sender: 'System', text: `🟢 ${peer.userName} (${peer.role}) joined the live classroom.`, time: peer.time },
      ]);
      try { sounds.playJoinCall(); } catch {}
    });

    socket.on('webrtc-offer', async ({ from, offer, userName, role: peerRole }) => {
      const label = userName ? `${userName} (${peerRole || 'peer'})` : undefined;
      if (label) setRemotePeerName(label);
      const pc = getOrCreatePeerConnection(from, label);
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('webrtc-answer', { to: from, answer });
      } catch (err) {
        console.warn('WebRTC offer handle error:', err);
      }
    });

    socket.on('webrtc-answer', async ({ from, answer }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.warn('WebRTC answer error:', err);
        }
      }
    });

    socket.on('webrtc-ice-candidate', async ({ from, candidate }) => {
      const pc = peerConnectionsRef.current.get(from);
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn('ICE candidate error:', err);
        }
      }
    });

    socket.on('webrtc-media-state', (state) => {
      setRemoteMediaState({ micOn: state.micOn, videoOn: state.videoOn });
    });

    socket.on('user-left', ({ socketId } = {}) => {
      setActivePeers((prev) => Math.max(1, prev - 1));
      if (socketId && peerConnectionsRef.current.has(socketId)) {
        peerConnectionsRef.current.get(socketId)?.close();
        peerConnectionsRef.current.delete(socketId);
      }
      if (peerConnectionsRef.current.size === 0) {
        setRemoteStream(null);
        setRemotePeerName(null);
      }
    });

    // Remote stroke from peer
    socket.on('draw-stroke', (data) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = data.isEraser ? '#ffffff' : data.color;
      ctx.lineWidth = data.isEraser ? data.width * 5 : data.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(data.x0, data.y0);
      ctx.lineTo(data.x1, data.y1);
      ctx.stroke();
      ctx.restore();
    });

    // Remote whiteboard clear
    socket.on('clear-whiteboard', () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      drawGrid(ctx, rect.width, rect.height);
    });

    // Remote chat
    socket.on('receive-chat', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
      try { sounds.playMessage(); } catch {}
    });

    // Remote reaction
    socket.on('receive-reaction', (data) => {
      triggerReaction(data.emoji, false);
    });

    // Remote shared notes update
    socket.on('receive-notes', (notesText) => {
      setSharedNotes(notesText);
    });

    return () => {
      peerConnectionsRef.current.forEach((pc) => pc.close());
      peerConnectionsRef.current.clear();
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      socket.disconnect();
    };
  }, [sessionId, role, currentUser, drawGrid]);

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

    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

    ctx.beginPath();
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penWidth * 5 : penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    ctx.stroke();

    // Broadcast stroke to peers in room
    socketRef.current?.emit('draw-stroke', {
      x0: p1.x,
      y0: p1.y,
      x1: midPoint.x,
      y1: midPoint.y,
      color: penColor,
      width: penWidth,
      isEraser,
    });
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
    try { sounds.playPop(); } catch {}
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGrid(ctx, rect.width, rect.height);

    // Broadcast clear
    socketRef.current?.emit('clear-whiteboard');
  };

  const downloadCanvas = () => {
    try { sounds.playClick(); } catch {}
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
    try { sounds.playClick(); } catch {}

    const myName = currentUser?.name || (role === 'tutor' ? 'Rajesh Sharma' : 'Alex Johnson');
    const msg = {
      sender: myName,
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Emit to room
    socketRef.current?.emit('send-chat', msg);
    setInputText('');
  };

  // Real AI Copilot calling Backend
  const handleAskAI = async (promptText?: string) => {
    const query = promptText || aiInput;
    if (!query.trim()) return;

    try { sounds.playClick(); } catch {}

    const userMsg: AIMessage = {
      role: 'user',
      content: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await api.askCopilot(query, session.subject, session.tutorName, aiMessages);
      try { sounds.playMessage(); } catch {}

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm ready to help! Review your problem statement and let's solve it step by step on the whiteboard.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const triggerReaction = (emoji: string, broadcast = true) => {
    try { sounds.playPop(); } catch {}
    setReaction(emoji);
    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    } catch {}
    if (broadcast) {
      socketRef.current?.emit('send-reaction', { emoji });
    }
    setTimeout(() => setReaction(null), 2500);
  };

  const handleNotesChange = (text: string) => {
    setSharedNotes(text);
    socketRef.current?.emit('update-notes', text);
  };

  const handleEndSession = () => {
    try { sounds.playLeaveCall(); } catch {}
    // If student, prompt completion & escrow release modal; if tutor, directly exit or show summary
    if (role === 'student') {
      setShowCompletionModal(true);
    } else {
      navigate('/tutor-dashboard');
    }
  };

  const handleDirectExit = () => {
    setShowCompletionModal(false);
    navigate(role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard');
  };

  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      // Find tutor id or use fallback tutor id
      const targetTutorId = session.tutorName?.toLowerCase().includes('rajesh') ? '1' : '2';
      
      await api.createReview({
        tutorId: targetTutorId,
        studentName: currentUser?.name || 'Alex Johnson',
        rating,
        comment: reviewComment,
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch {}

      setTimeout(() => {
        handleDirectExit();
      }, 900);
    } catch (err) {
      console.error('Failed to submit review:', err);
      handleDirectExit();
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-white overflow-hidden select-none">
      
      {/* Top Header Bar */}
      <header className="h-14 sm:h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        
        {/* Title & Connection Status */}
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <div className="p-1.5 sm:p-2 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl shadow-md flex-shrink-0">
            <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-base font-black text-white truncate">
                {session.subject} Classroom
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 ${
                isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isConnected ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
                {isConnected ? `P2P Live (${activePeers})` : 'Offline Mode'}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 truncate">
              Mentor: {session.tutorName}
            </p>
          </div>
        </div>

        {/* Live Timer */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700 text-xs font-mono font-bold text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{formatTimer(secondsElapsed)}</span>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setMobileTab('canvas')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'canvas' ? 'bg-primary-600 text-white' : 'text-slate-400'
            }`}
          >
            Board
          </button>
          <button
            onClick={() => setMobileTab('chat')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              mobileTab === 'chat' ? 'bg-primary-600 text-white' : 'text-slate-400'
            }`}
          >
            Chat & AI
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={downloadCanvas}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all shadow-sm"
          >
            <Download className="h-3.5 w-3.5" /> Save Notes
          </button>
          <button 
            onClick={handleEndSession}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <PhoneOff className="h-3.5 w-3.5" /> 
            <span className="hidden sm:inline">End Call</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Area: Videos + Whiteboard */}
        <div className={`flex-1 flex flex-col p-2 sm:p-4 gap-2 sm:gap-4 overflow-hidden ${mobileTab === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Dual Video Stream Bar */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 h-32 sm:h-44 md:h-48 flex-shrink-0">
            
            {/* Remote Tutor / Peer WebRTC Video Feed */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group flex items-center justify-center">
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80" 
                    alt="Tutor"
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-950/75 border border-white/10 text-[9px] font-bold text-slate-300 backdrop-blur-md">
                    {activePeers > 1 ? 'Peer Audio/Cam Standby' : 'Waiting for 2nd Peer Tab'}
                  </div>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white border border-white/10">
                <span className={`h-2 w-2 rounded-full ${remoteStream ? 'bg-emerald-500 animate-pulse' : remoteMediaState.micOn ? 'bg-amber-400' : 'bg-rose-500'}`} />
                <span className="truncate">{remotePeerName || `${session.tutorName} (Tutor)`}</span>
              </div>
            </div>

            {/* Local Student / User Video Feed */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md flex items-center justify-center">
              {hasWebcam && videoOn ? (
                <video 
                  ref={userVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${screenSharing ? '' : 'transform -scale-x-100'}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary-600/30 text-primary-300 flex items-center justify-center text-xl sm:text-2xl font-black mb-1 border border-primary-500/30 shadow-inner">
                    {(currentUser?.name || 'Alex').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-300">
                    {currentUser?.name || 'Alex Johnson'} (You)
                  </span>
                  <span className="text-[9px] text-slate-500">Camera Off</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-white border border-white/10">
                <span className={`h-2 w-2 rounded-full ${micOn ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span>You</span>
              </div>
            </div>

          </div>

          {/* Collaborative Whiteboard Canvas Container */}
          <div className="flex-1 relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-white flex flex-col">
            
            {/* Whiteboard Floating Toolbar */}
            <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl max-w-[95%] overflow-x-auto no-scrollbar">
              
              {/* Color Palette */}
              {['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#1e293b'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    setPenColor(color);
                    setIsEraser(false);
                    try { sounds.playClick(); } catch {}
                  }}
                  className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 transition-transform ${
                    penColor === color && !isEraser
                      ? 'scale-125 border-white shadow-md'
                      : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}

              <div className="h-4 w-[1px] bg-slate-800 mx-1 flex-shrink-0" />

              {/* Pen Tool */}
              <button
                type="button"
                onClick={() => {
                  setIsEraser(false);
                  try { sounds.playClick(); } catch {}
                }}
                className={`p-1.5 rounded-xl transition-all ${
                  !isEraser ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Pen"
              >
                <PenTool className="h-4 w-4" />
              </button>

              {/* Eraser Tool */}
              <button
                type="button"
                onClick={() => {
                  setIsEraser(true);
                  try { sounds.playClick(); } catch {}
                }}
                className={`p-1.5 rounded-xl transition-all ${
                  isEraser ? 'bg-primary-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
                title="Eraser"
              >
                <Eraser className="h-4 w-4" />
              </button>

              {/* Clear Canvas */}
              <button
                type="button"
                onClick={clearCanvas}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                title="Clear Whiteboard"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <div className="h-4 w-[1px] bg-slate-800 mx-1 flex-shrink-0" />

              {/* Live Emoji Reactions */}
              {['👍', '💡', '🔥', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => triggerReaction(emoji)}
                  className="p-1 hover:scale-125 active:scale-95 transition-transform text-sm sm:text-base"
                >
                  {emoji}
                </button>
              ))}

            </div>

            {/* Floating Reaction Overlay */}
            {reaction && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30 animate-in zoom-in-50 duration-200">
                <span className="text-7xl sm:text-9xl drop-shadow-2xl animate-bounce">{reaction}</span>
              </div>
            )}

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="w-full h-full cursor-crosshair touch-none bg-white block"
            />

            {/* Bottom Hardware Controls Pill */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 p-1.5 bg-slate-950/85 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl">
              <button
                onClick={toggleMic}
                className={`p-2 rounded-xl transition-all ${
                  micOn ? 'bg-slate-800 text-white' : 'bg-rose-600 text-white'
                }`}
                title={micOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-2 rounded-xl transition-all ${
                  videoOn ? 'bg-slate-800 text-white' : 'bg-rose-600 text-white'
                }`}
                title={videoOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-2 rounded-xl transition-all ${
                  screenSharing ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white'
                }`}
                title="Share Screen"
              >
                <ScreenShare className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Sidebar: Tabs for Chat, Shared Notes & AI Copilot */}
        <aside className={`w-full md:w-80 lg:w-96 bg-slate-950 border-l border-slate-800 flex flex-col z-20 ${mobileTab === 'canvas' ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Sub-tabs header */}
          <div className="p-2 sm:p-3 bg-slate-900 border-b border-slate-800 flex gap-1 flex-shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Live Chat
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Notes
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bot className="h-3.5 w-3.5 text-amber-300" /> AI Copilot
            </button>
          </div>

          {/* TAB 1: Real-Time Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 sm:p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {chatMessages.map((msg, idx) => {
                  const isYou = msg.sender === 'You' || msg.sender === currentUser?.name;
                  const isSystem = msg.sender === 'System';

                  if (isSystem) {
                    return (
                      <div key={idx} className="text-center my-2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 py-1 px-3 rounded-full border border-emerald-500/20">
                        {msg.text}
                      </div>
                    );
                  }

                  return (
                    <div key={idx} className={`flex flex-col ${isYou ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] text-slate-500 font-medium mb-1">
                        {msg.sender} • {msg.time}
                      </span>
                      <div className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                        isYou
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question in call..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-md transition-all flex items-center justify-center"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Shared Collaborative Notes */}
          {activeTab === 'notes' && (
            <div className="flex-1 flex flex-col p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Collaborative Notepad</span>
                <span className="text-[10px] text-primary-400 font-mono">Live synced via socket</span>
              </div>
              <textarea
                value={sharedNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-primary-500 resize-none leading-relaxed"
                placeholder="Type lesson notes or formulas here..."
              />
            </div>
          )}

          {/* TAB 3: Live AI Copilot */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden p-3 sm:p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl text-xs ${
                    msg.role === 'assistant'
                      ? 'bg-slate-900 border border-primary-500/30 text-slate-200'
                      : 'bg-primary-600/30 border border-primary-500/40 text-primary-100 ml-4'
                  }`}>
                    <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        {msg.role === 'assistant' ? <Sparkles className="h-3 w-3 text-amber-300" /> : null}
                        {msg.role === 'assistant' ? 'Gemini AI Copilot' : 'You'}
                      </span>
                      <span>{msg.time}</span>
                    </div>
                    <MathMarkdown content={msg.content} className="text-xs leading-relaxed" />
                  </div>
                ))}
                {aiLoading && (
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary-500 animate-ping" />
                    <span>Solving with Google Gemini AI...</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {['Chain rule example', 'Practice challenge', 'Lesson summary'].map((quick) => (
                    <button
                      key={quick}
                      onClick={() => handleAskAI(quick)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] text-slate-400 font-semibold transition-colors"
                    >
                      {quick}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                    placeholder="Ask AI step-by-step math, physics or code..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                  <button
                    onClick={() => handleAskAI()}
                    disabled={aiLoading}
                    className="p-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </aside>

      </div>

      {/* Post-Session Completion & Escrow Release Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-white space-y-5">
            
            {/* Top Badge */}
            <div className="text-center space-y-2">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">Lesson Completed!</h3>
              <p className="text-xs text-slate-400 font-medium">
                {session.subject} with {session.tutorName}
              </p>
            </div>

            {/* Escrow Release Notice */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-bold">Escrow Payout Released</span>
                <p className="text-[11px] text-emerald-400/80 leading-snug">
                  NPR {session.price || 1500} has been released safely to {session.tutorName}.
                </p>
              </div>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-2 text-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Rate Your Experience
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      try { sounds.playClick(); } catch {}
                      setRating(star);
                    }}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= rating
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonial Review Textarea */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Your Review & Feedback
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 font-medium leading-relaxed"
                placeholder="Share how this mentor helped you understand today's concepts..."
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                disabled={isSubmittingReview}
                onClick={handleSubmitReview}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-primary-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                {isSubmittingReview ? 'Submitting to Database...' : 'Submit Review & Exit'}
              </button>
              <button
                type="button"
                onClick={handleDirectExit}
                className="py-3 px-4 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors"
              >
                Skip & Return
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Classroom;
