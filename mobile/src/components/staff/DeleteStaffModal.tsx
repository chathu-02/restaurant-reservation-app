import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: StaffMember | null;
  onConfirm: (id: string) => Promise<void>;
}

export const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({
  isOpen,
  onClose,
  member,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!member) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(member.id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Staff Account"
      subtitle="Confirm deletion from restaurant roster"
    >
      <div className="flex flex-col gap-4">
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            Are you sure you want to remove <strong>{member.name}</strong> ({member.staffCode})? This will revoke active POS terminal access and duty roster assignments.
          </div>
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
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="flex-1"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Modal>
  );
};
