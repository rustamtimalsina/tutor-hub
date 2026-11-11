import React, { useState } from 'react';
import { 
  X, CheckCircle, Calendar as CalendarIcon, Clock, Sparkles, 
  ArrowRight, ShieldCheck, Receipt, Wallet, Lock, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Tutor } from '../types';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { sounds } from '../utils/soundEffects';
import { api } from '../services/api';

interface BookingModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
}

const MORNING_SLOTS = ['09:00 AM', '10:30 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['02:00 PM', '03:30 PM', '04:30 PM'];
const EVENING_SLOTS = ['06:00 PM', '07:30 PM', '08:30 PM'];

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, isOpen, onClose }) => {
  const { addSession } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  
  // Date selection (default today)
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split('T')[0]
  );
  
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  const [duration, setDuration] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || 'General');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'esewa' | 'card'>('khalti');
  const [walletPhone, setWalletPhone] = useState('9801234567');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txRef, setTxRef] = useState('');

  if (!isOpen) return null;

  const totalPrice = tutor.price * duration;

  // Calendar calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    try { sounds.playClick(); } catch {}
    const m = (currentMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    setSelectedDate(`${currentYear}-${m}-${d}`);
  };

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) return;
    try { sounds.playClick(); } catch {}
    setStep('payment');
  };

  const handleRealEsewaRedirect = async () => {
    try { sounds.playClick(); } catch {}
    setIsProcessing(true);

    try {
      const payload = await api.initiateEsewa(totalPrice);
      if (payload?.gatewayUrl && payload?.fields) {
        // Save pending booking to finalize upon return from eSewa Sandbox
        sessionStorage.setItem(
          'pendingEsewaBooking',
          JSON.stringify({
            tutorName: tutor.name,
            subject: selectedSubject,
            date: selectedDate,
            time: selectedTime,
            duration: `${duration} hour${duration > 1 ? 's' : ''}`,
            price: totalPrice,
            status: 'Upcoming',
          })
        );

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payload.gatewayUrl;
        Object.entries(payload.fields).forEach(([key, val]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = val;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
      }
      // Fallback if backend is unreachable
      await handleProcessPayment();
    } catch (err) {
      console.error('eSewa redirect error:', err);
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = async () => {
    try { sounds.playClick(); } catch {}
    setIsProcessing(true);

    try {
      let ref = '';
      if (paymentMethod === 'khalti') {
        const khaltiRes = await api.initiateKhalti({
          amount: totalPrice,
          tutorName: tutor.name,
        });
        if (khaltiRes.mode === 'live-redirect' && khaltiRes.paymentUrl) {
          sessionStorage.setItem(
            'pendingEsewaBooking',
            JSON.stringify({
              tutorName: tutor.name,
              subject: selectedSubject,
              date: selectedDate,
              time: selectedTime,
              duration: `${duration} hour${duration > 1 ? 's' : ''}`,
              price: totalPrice,
              status: 'Upcoming',
            })
          );
          window.location.href = khaltiRes.paymentUrl;
          return;
        }
        ref = khaltiRes.transactionRef || `KHALTI-SANDBOX-${Date.now()}`;
      } else {
        const verification = await api.verifyPayment(paymentMethod, totalPrice);
        ref = verification.transactionRef;
      }

      setTxRef(ref);

      try { sounds.playSuccess(); } catch {}

      // Add to store and sync with database
      await addSession({
        tutorName: tutor.name,
        subject: selectedSubject,
        date: selectedDate,
        time: selectedTime,
        duration: `${duration} hour${duration > 1 ? 's' : ''}`,
        price: totalPrice,
        status: 'Upcoming',
      });

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch {}

      setStep('success');
    } catch (err) {
      console.error('Payment processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('select');
    onClose();
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate('/student-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-3 sm:p-6 text-center">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" 
          aria-hidden="true" 
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white dark:bg-slate-900 rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full border border-slate-200 dark:border-slate-800 z-10 text-slate-800 dark:text-slate-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 px-6 py-5 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-black leading-tight" id="modal-title">
                  {step === 'select' && `Book Session with ${tutor.name}`}
                  {step === 'payment' && 'Secure Escrow Checkout'}
                  {step === 'success' && 'Booking Confirmed!'}
                </h3>
                <p className="text-xs text-white/80 font-medium mt-0.5">
                  {step === 'select' && `NPR ${tutor.price}/hr • ${tutor.subjects.join(', ')}`}
                  {step === 'payment' && 'Held in escrow until session completion'}
                  {step === 'success' && 'Ready for your live interactive 3D classroom'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-7 max-h-[82vh] overflow-y-auto">
            
            {/* STEP 1: Cal.com Visual Calendar & Time Slots */}
            {step === 'select' && (
              <div className="space-y-6">
                
                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => {
                          try { sounds.playClick(); } catch {}
                          setSelectedSubject(sub);
                        }}
                        className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                          selectedSubject === sub
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 21st.dev Visual Calendar */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                      <CalendarIcon className="h-4 w-4 text-primary-500" />
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day Names */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-slate-400 mb-2">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                  </div>

                  {/* Calendar Day Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNumber = i + 1;
                      const m = (currentMonth + 1).toString().padStart(2, '0');
                      const d = dayNumber.toString().padStart(2, '0');
                      const dateStr = `${currentYear}-${m}-${d}`;
                      const isSelected = selectedDate === dateStr;

                      return (
                        <button
                          key={dayNumber}
                          type="button"
                          onClick={() => handleSelectDay(dayNumber)}
                          className={`p-2 rounded-xl font-bold transition-all ${
                            isSelected
                              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 scale-105'
                              : 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {dayNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categorized Time Slots */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary-500" /> Select Preferred Time Slot
                  </label>
                  
                  <div className="space-y-2.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Morning</span>
                      <div className="grid grid-cols-3 gap-2">
                        {MORNING_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              try { sounds.playClick(); } catch {}
                              setSelectedTime(time);
                            }}
                            className={`text-xs py-2 px-2.5 rounded-xl font-bold border transition-all ${
                              selectedTime === time
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25 scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Afternoon</span>
                      <div className="grid grid-cols-3 gap-2">
                        {AFTERNOON_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              try { sounds.playClick(); } catch {}
                              setSelectedTime(time);
                            }}
                            className={`text-xs py-2 px-2.5 rounded-xl font-bold border transition-all ${
                              selectedTime === time
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25 scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Evening</span>
                      <div className="grid grid-cols-3 gap-2">
                        {EVENING_SLOTS.map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => {
                              try { sounds.playClick(); } catch {}
                              setSelectedTime(time);
                            }}
                            className={`text-xs py-2 px-2.5 rounded-xl font-bold border transition-all ${
                              selectedTime === time
                                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/25 scale-105'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-400'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 1.5, 2].map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => {
                          try { sounds.playClick(); } catch {}
                          setDuration(dur);
                        }}
                        className={`py-2.5 px-3 text-xs rounded-xl font-bold border transition-all ${
                          duration === dur
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {dur} hour{dur > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown Banner */}
                <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Total Escrow Amount</span>
                    <span className="text-2xl font-black text-primary-700 dark:text-primary-300">NPR {totalPrice}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>{duration} hr @ NPR {tutor.price}/hr</span>
                    <span className="block text-emerald-600 dark:text-emerald-400 font-bold">100% Escrow Protected</span>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full py-3.5 bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Proceed to Escrow Checkout <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

            {/* STEP 2: Nepal Payment Gateway Checkout */}
            {step === 'payment' && (
              <div className="space-y-6">
                
                {/* Booking Summary Box */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Tutor:</span>
                    <span className="text-slate-900 dark:text-white">{tutor.name}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Scheduled:</span>
                    <span className="text-slate-900 dark:text-white">{selectedDate} @ {selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Duration:</span>
                    <span className="text-slate-900 dark:text-white">{duration} hour{duration > 1 ? 's' : ''} ({selectedSubject})</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-black">
                    <span className="text-slate-800 dark:text-slate-200">Amount Due:</span>
                    <span className="text-primary-600 dark:text-primary-400 text-lg">NPR {totalPrice}</span>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                    Select Nepali Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    
                    {/* Khalti */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 ring-2 ring-purple-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base font-black text-purple-700 dark:text-purple-300">Khalti</span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">Wallet Pay</span>
                    </button>

                    {/* eSewa */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'esewa'
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">eSewa</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Instant Pay</span>
                    </button>

                    {/* Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-base font-black text-indigo-600 dark:text-indigo-400">Card</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">Visa / SCT</span>
                    </button>

                  </div>
                </div>

                {/* Mobile Wallet Input */}
                {(paymentMethod === 'khalti' || paymentMethod === 'esewa') && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      {paymentMethod === 'khalti' ? 'Khalti Mobile ID' : 'eSewa Registered Number'}
                    </label>
                    <input
                      type="text"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}

                {/* eSewa UAT Sandbox Test Credentials Info */}
                {paymentMethod === 'esewa' && (
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                    <span className="font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                      eSewa UAT Sandbox Test Credentials
                    </span>
                    <div className="font-mono flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
                      <span>ID: <strong>9806800001</strong></span>
                      <span>MPIN: <strong>1122</strong></span>
                      <span>OTP: <strong>123456</strong></span>
                    </div>
                  </div>
                )}

                {/* Escrow Guarantee Pill */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="font-semibold leading-snug">
                    Funds are safely held in Escrow and only transferred to the educator once your lesson finishes.
                  </span>
                </div>

                {/* Step 2 Actions */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep('select')}
                      className="py-3 px-5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={paymentMethod === 'esewa' ? handleRealEsewaRedirect : handleProcessPayment}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing
                        ? 'Connecting to Sandbox Gateway...'
                        : paymentMethod === 'esewa'
                        ? `Pay NPR ${totalPrice} on eSewa Sandbox →`
                        : `Lock NPR ${totalPrice} in Escrow`}
                    </button>
                  </div>
                  {paymentMethod === 'esewa' && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleProcessPayment}
                      className="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
                    >
                      Or complete via Instant Local Escrow Demo (skip eSewa redirect)
                    </button>
                  )}
                </div>

              </div>
            )}

            {/* STEP 3: Confirmed Success */}
            {step === 'success' && (
              <div className="py-6 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white">Booking & Escrow Confirmed!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    Your session with <span className="font-bold text-slate-800 dark:text-slate-200">{tutor.name}</span> has been locked into Escrow.
                  </p>
                </div>

                {txRef && (
                  <div className="inline-block px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    Ref: {txRef}
                  </div>
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black shadow-md transition-all"
                  >
                    View in Student Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="py-3 px-5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default BookingModal;
