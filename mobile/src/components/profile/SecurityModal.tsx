import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Lock, KeyRound } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useToast();
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPin) {
      setError('Please enter your current PIN');
      return;
    }
    if (newPin.length < 4) {
      setError('New PIN must be at least 4 digits');
      return;
    }
    if (newPin !== confirmPin) {
      setError('New PIN and confirmation do not match');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Security PIN successfully updated', 'success');
      onClose();
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setError('');
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Security & Passcode"
      subtitle="Update POS terminal quick-login PIN"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs font-medium p-3 rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <Input
          label="Current PIN"
          type="password"
          maxLength={6}
          placeholder="••••"
          value={currentPin}
          onChange={(e) => setCurrentPin(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <Input
          label="New Security PIN"
          type="password"
          maxLength={6}
          placeholder="4-6 digit numeric PIN"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
          leftIcon={<KeyRound className="w-4 h-4" />}
        />

        <Input
          label="Confirm New Security PIN"
          type="password"
          maxLength={6}
          placeholder="Re-enter new PIN"
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value)}
          leftIcon={<KeyRound className="w-4 h-4" />}
        />

        <div className="flex gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} className="flex-1 bg-[#181A1E]">
            Update PIN
          </Button>
        </div>
      </form>
    </Modal>
  );
};
