import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { Lock } from 'lucide-react';

interface CustomerPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerPasswordModal: React.FC<CustomerPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setError('Please enter your current password');
      return;
    }
    if (newPass.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    showToast('Customer password updated successfully', 'success');
    onClose();
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change Password"
      subtitle="Protect your customer account credentials"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded-xl border border-rose-200">
            {error}
          </div>
        )}
        <Input
          label="Current Password"
          type="password"
          isPassword
          placeholder="Enter current password"
          value={currentPass}
          onChange={(e) => setCurrentPass(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />
        <Input
          label="New Password"
          type="password"
          isPassword
          placeholder="At least 6 characters"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />
        <Input
          label="Confirm New Password"
          type="password"
          isPassword
          placeholder="Repeat new password"
          value={confirmPass}
          onChange={(e) => setConfirmPass(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
        />
        <div className="flex gap-2.5 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1 bg-[#181A1E]">
            Save Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};
