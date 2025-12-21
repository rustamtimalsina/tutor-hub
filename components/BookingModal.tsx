import React, { useState } from 'react';
import { X, CheckCircle, Calendar, Clock, DollarSign } from 'lucide-react';
import { Tutor, BookingDetails } from '../types';

interface BookingModalProps {
  tutor: Tutor;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ tutor, isOpen, onClose }) => {
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<number>(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setStep('success');
  };

  const totalPrice = tutor.price * duration;
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {step === 'success' ? 'Booking Confirmed!' : `Book a Session with ${tutor.name}`}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            
            {step === 'select' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 border p-2"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`text-sm py-2 px-3 rounded-md border ${
                          selectedTime === time 
                          ? 'bg-primary-600 text-white border-primary-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md border"
                  >
                    <option value={1}>1 hour</option>
                    <option value={1.5}>1.5 hours</option>
                    <option value={2}>2 hours</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-md flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Price:</span>
                  <span className="text-xl font-bold text-gray-900">NPR {totalPrice}</span>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">Your session is confirmed!</p>
                <div className="text-gray-500 text-sm space-y-1 mb-6">
                  <p>{selectedDate} at {selectedTime}</p>
                  <p>Duration: {duration} hour(s)</p>
                  <p className="font-semibold text-gray-900 mt-2">Total: NPR {totalPrice}</p>
                </div>
                <p className="text-gray-500 text-sm">A confirmation has been sent. The tutor will contact you shortly.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 'select' && (
              <>
                <button 
                  type="button" 
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${(!selectedDate || !selectedTime) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleConfirm}
                >
                  Confirm Booking
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Cancel
                </button>
              </>
            )}
            {step === 'success' && (
              <button 
                type="button" 
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-gray-800 focus:outline-none sm:w-full sm:text-sm"
                onClick={onClose}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;