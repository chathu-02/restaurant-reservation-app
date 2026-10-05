import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';
import { Calendar, Users, Phone, Clock, FileText } from 'lucide-react';

interface NewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  isOpen,
  onClose,
  onBookingCreated,
}) => {
  const { showToast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [time, setTime] = useState('7:30 PM');
  const [phone, setPhone] = useState('');
  const [tablePreference, setTablePreference] = useState('Main Dining');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ guestName?: string; phone?: string }>({});

  const validate = () => {
    const errs: { guestName?: string; phone?: string } = {};
    if (!guestName.trim()) {
      errs.guestName = 'Guest name is required';
    }
    if (!phone.trim()) {
      errs.phone = 'Phone number is required for booking confirmation';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await dashboardService.createBooking({
        guestName: guestName.trim(),
        partySize: parseInt(partySize, 10) || 2,
        time,
        phone: phone.trim(),
        tablePreference,
        notes: notes.trim(),
      });
      showToast(res.message, 'success');
      onBookingCreated?.();
      onClose();
      // Reset form
      setGuestName('');
      setPhone('');
      setNotes('');
    } catch (err: any) {
      showToast(err.message || 'Failed to create booking', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Reservation"
      subtitle="Book a dining table for arriving guests"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Guest Name *"
          placeholder="e.g. David Miller"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          error={errors.guestName}
          leftIcon={<Users className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Party Size *"
            type="number"
            min="1"
            max="20"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            leftIcon={<Users className="w-4 h-4" />}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs sm:text-sm font-semibold text-zinc-800">
              Time Slot *
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-10 pr-4 py-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="6:00 PM">6:00 PM</option>
                <option value="6:30 PM">6:30 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM (Peak Rush)</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="8:30 PM">8:30 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
            </div>
          </div>
        </div>

        <Input
          label="Guest Mobile Phone *"
          placeholder="+1 (555) 019-2834"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          leftIcon={<Phone className="w-4 h-4" />}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs sm:text-sm font-semibold text-zinc-800">
            Seating Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Main Dining', 'Patio / Window', 'Private Booth'].map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setTablePreference(pref)}
                className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                  tablePreference === pref
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Special Requests / Dietary Notes"
          placeholder="e.g. Birthday celebration, high-chair needed"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          leftIcon={<FileText className="w-4 h-4" />}
        />

        <div className="flex gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 bg-[#181A1E]"
          >
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};
