import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CreditCard, Check, Plus } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface PaymentMethodsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPayment: string;
}

export const PaymentMethodsModal: React.FC<PaymentMethodsModalProps> = ({
  isOpen,
  onClose,
  defaultPayment,
}) => {
  const { showToast } = useToast();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Payment Methods"
      subtitle="Saved cards for pre-authorization and deposits"
    >
      <div className="flex flex-col gap-3">
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-zinc-900">
                {defaultPayment}
              </div>
              <div className="text-[11px] text-zinc-400">Default for booking guarantees</div>
            </div>
          </div>
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </span>
        </div>

        <button
          onClick={() => showToast('New card tokenization modal simulated', 'info')}
          className="border-2 border-dashed border-zinc-200 rounded-2xl p-3.5 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 hover:border-zinc-400 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Card</span>
        </button>

        <Button variant="primary" onClick={onClose} fullWidth className="bg-[#181A1E] mt-2">
          Done
        </Button>
      </div>
    </Modal>
  );
};
