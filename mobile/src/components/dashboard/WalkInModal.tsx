import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { dashboardService } from '../../services/dashboardService';
import { useToast } from '../../context/ToastContext';
import { Users, Phone, Clock } from 'lucide-react';

interface WalkInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWalkInAdded?: () => void;
}

export const WalkInModal: React.FC<WalkInModalProps> = ({
  isOpen,
  onClose,
  onWalkInAdded,
}) => {
  const { showToast } = useToast();
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError('Please provide guest name');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await dashboardService.addWalkIn({
        guestName: guestName.trim(),
        partySize: parseInt(partySize, 10) || 2,
        phone: phone.trim() || 'N/A',
      });
      showToast(res.message, 'success');
      onWalkInAdded?.();
      onClose();
      setGuestName('');
      setPhone('');
    } catch (err: any) {
      showToast(err.message || 'Failed to add walk-in', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register Walk-in Guest"
      subtitle="Add party to live dining queue"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="bg-[#FFFBEB] border border-amber-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-amber-900">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Current estimated wait time is <strong>~12 minutes</strong> for parties of 2 to 4.</span>
        </div>

        <Input
          label="Guest Name *"
          placeholder="e.g. Michael Chang"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          error={error}
          leftIcon={<Users className="w-4 h-4" />}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Party Size *"
            type="number"
            min="1"
            max="12"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            leftIcon={<Users className="w-4 h-4" />}
          />
          <Input
            label="SMS Notification Phone"
            placeholder="+1 (555) 012-3456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

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
            Add to Queue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
