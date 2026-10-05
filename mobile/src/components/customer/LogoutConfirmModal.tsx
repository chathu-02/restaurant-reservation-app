import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Out of Account"
      subtitle="End your customer mobile session"
    >
      <div className="flex flex-col gap-4">
        <div className="bg-[#FFF5F5] border border-[#FED7D7] rounded-2xl p-4 flex items-start gap-3 text-rose-900">
          <LogOut className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            Are you sure you want to log out, <strong>{userName}</strong>? Your active queue position and booking alerts will remain synchronized to your mobile number.
          </div>
        </div>

        <div className="flex gap-2.5 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1"
          >
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};
