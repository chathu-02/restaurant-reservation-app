import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

interface LeaveQueueConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  position: number;
}

export const LeaveQueueConfirmModal: React.FC<LeaveQueueConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  position,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave the Queue?"
      subtitle="Release your dining position"
    >
      <div className="flex flex-col gap-4">
        <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            You are currently <strong>#{position} in line</strong>. If you leave now, you will lose your spot and estimated ~15 min wait time.
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Stay in Line
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isLoading}
            onClick={handleConfirm}
            className="flex-1"
          >
            Leave Queue
          </Button>
        </div>
      </div>
    </Modal>
  );
};
