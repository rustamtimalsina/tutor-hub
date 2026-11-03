import React, { useState } from 'react';
import { 
  X, CheckCircle, Calendar, Clock, DollarSign, Sparkles, 
  ArrowRight, CreditCard, ShieldCheck, Receipt, Wallet, Lock
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

const BookingModal: React.FC<BookingModalProps> = ({ tutor, isOpen, onClose }) => {
  const { addSession } = useApp();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'select' | 'payment' | 'success'>('select');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);
  const [selectedSubject, setSelectedSubject] = useState<string>(tutor.subjects[0] || 'General');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'khalti' | 'esewa' | 'card'>('khalti');
  const [walletPhone, setWalletPhone] = useState('98XXXXXXXX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txRef, setTxRef] = useState('');

  if (!isOpen) return null;

  const totalPrice = tutor.price * duration;
  const timeSlots = ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '06:30 PM'];

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) return;
    sounds.playClick();
    setStep('payment');
  };

  const handleProcessPayment = async () => {
    try { sounds.playClick(); } catch {}
    setIsProcessing(true);

    try {
      // Real sandbox gateway verification
      const verification = await api.verifyPayment(paymentMethod, totalPrice);
      setTxRef(verification.transactionRef);

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
          particleCount: 100,
          spread: 80,
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
    setSelectedDate('');
    setSelectedTime('');
    onClose();
  };

  const handleGoToDashboard = () => {
    handleClose();
    navigate('/student-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-100 z-10">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 px-6 py-5 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight" id="modal-title">
                  {step === 'select' && `Schedule with ${tutor.name}`}
                  {step === 'payment' && 'Secure Escrow Checkout'}
                  {step === 'success' && 'Booking Confirmed!'}
                </h3>
                <p className="text-xs text-primary-200 mt-0.5">
                  {step === 'select' && `NPR ${tutor.price}/hr • ${tutor.experience} Experience`}
                  {step === 'payment' && 'Protected by 256-bit encrypted escrow'}
                  {step === 'success' && 'Session successfully booked & added to calendar'}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose} 
              className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            
            {/* STEP 1: Select Date & Time */}
            {step === 'select' && (
              <div className="space-y-5">
                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Subject</label>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((sub) => (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => setSelectedSubject(sub)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${
                          selectedSubject === sub
                            ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary-600" /> Select Date
                  </label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 border p-3 text-sm text-slate-800 bg-slate-50 font-medium"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary-600" /> Select Time Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`text-xs py-2.5 px-3 rounded-xl font-semibold border transition-all ${
                          selectedTime === time 
                          ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-200 scale-105' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-primary-400 hover:bg-primary-50/50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 1.5, 2].map((dur) => (
                      <button
                        type="button"
                        key={dur}
                        onClick={() => setDuration(dur)}
                        className={`py-2 px-3 text-xs rounded-xl font-semibold border transition-all ${
                          duration === dur
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {dur} hour{dur > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Summary Banner */}
                <div className="bg-gradient-to-br from-primary-50 to-indigo-50/50 p-4 rounded-2xl border border-primary-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-primary-700">Total Investment</span>
                    <p className="text-xs text-slate-500">Live 1-on-1 Room + Recording</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary-950">NPR {totalPrice}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Payment Gateway Selection */}
            {step === 'payment' && (
              <div className="space-y-5">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Session:</span>
                    <p className="font-bold text-slate-900">{selectedSubject} ({duration} hr)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 font-medium">Payable:</span>
                    <p className="text-base font-black text-emerald-600">NPR {totalPrice}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('khalti')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        paymentMethod === 'khalti'
                          ? 'border-purple-600 bg-purple-50 shadow-md ring-2 ring-purple-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-[10px] mx-auto mb-1">
                        K
                      </div>
                      <span className="block text-xs font-bold text-slate-900">Khalti</span>
                      <span className="text-[10px] text-purple-700 font-semibold">Wallet / eBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('esewa')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        paymentMethod === 'esewa'
                          ? 'border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="h-6 w-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-[10px] mx-auto mb-1">
                        e
                      </div>
                      <span className="block text-xs font-bold text-slate-900">eSewa</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Direct Pay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-2xl border-2 text-center transition-all ${
                        paymentMethod === 'card'
                          ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-200'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className="h-6 w-6 text-indigo-600 mx-auto mb-1" />
                      <span className="block text-xs font-bold text-slate-900">Visa / Card</span>
                      <span className="text-[10px] text-indigo-700 font-semibold">International</span>
                    </button>
                  </div>
                </div>

                {paymentMethod !== 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        {paymentMethod === 'khalti' ? 'Khalti Registered Mobile Number' : 'eSewa ID / Mobile Number'}
                      </label>
                      <input
                        type="text"
                        value={walletPhone}
                        onChange={(e) => setWalletPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800"
                        placeholder="98XXXXXXXX"
                      />
                    </div>
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-800 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                      <span>Funds are held in secure escrow until your lesson is successfully completed.</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4242 •••• •••• 4242"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-mono font-bold text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Success Screen */}
            {step === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-4 animate-bounce">
                  <CheckCircle className="h-12 w-12 text-emerald-600" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 mb-1">Payment Successful!</h4>
                <p className="text-xs text-slate-500 mb-6">Txn Ref: <span className="font-mono font-bold text-slate-700">{txRef}</span></p>
                
                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-2 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Educator:</span>
                    <span className="font-bold text-slate-800">{tutor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subject:</span>
                    <span className="font-semibold text-primary-700">{selectedSubject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Time:</span>
                    <span className="font-semibold text-slate-800">{selectedDate} @ {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-semibold text-slate-800 uppercase">{paymentMethod} Escrow</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">Total Paid:</span>
                    <span className="font-black text-emerald-600 text-base">NPR {totalPrice}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row-reverse gap-2 border-t border-slate-100">
            {step === 'select' && (
              <>
                <button 
                  type="button" 
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-primary-200 hover:from-primary-700 hover:to-indigo-700 transition-all ${
                    (!selectedDate || !selectedTime) ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:-translate-y-0.5'
                  }`}
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  type="button" 
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl px-5 py-3 bg-white text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </>
            )}

            {step === 'payment' && (
              <>
                <button 
                  type="button" 
                  disabled={isProcessing}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all"
                  onClick={handleProcessPayment}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 animate-spin" /> Verifying...
                    </span>
                  ) : (
                    `Pay NPR ${totalPrice} with ${paymentMethod.toUpperCase()}`
                  )}
                </button>
                <button 
                  type="button" 
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl px-5 py-3 bg-white text-sm font-bold text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                  onClick={() => setStep('select')}
                >
                  Back
                </button>
              </>
            )}

            {step === 'success' && (
              <>
                <button 
                  type="button" 
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-primary-600 text-sm font-bold text-white hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
                  onClick={handleGoToDashboard}
                >
                  View in Student Dashboard <ArrowRight className="h-4 w-4" />
                </button>
                <button 
                  type="button" 
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl px-5 py-3 bg-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-300 transition-colors"
                  onClick={handleClose}
                >
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
