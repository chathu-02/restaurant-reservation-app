import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PhoneCall, ShieldAlert, BookOpen } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotline?: string;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  hotline = '+1 (800) 555-STITCH (Ext 401)',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Help & Manager Desk"
      subtitle="Shift support & emergency operational override"
    >
      <div className="flex flex-col gap-4">
        {/* Hotline */}
        <div className="bg-[#EEF2FF] border border-[#C7D2FE] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm mb-1">
            <PhoneCall className="w-4 h-4 text-indigo-600" />
            <span>Duty Manager Direct Hotline</span>
          </div>
          <p className="text-xs text-indigo-900 font-semibold mt-1">{hotline}</p>
          <p className="text-[11px] text-indigo-700/80 mt-0.5">
            24/7 technical and table allocation escalation desk.
          </p>
        </div>

        {/* Override Guidelines */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-2 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5 font-bold text-zinc-800">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Emergency Floor Override Code</span>
          </div>
          <p>
            In case of POS sync failure or table clash, enter manager security PIN to trigger manual table release override.
          </p>
        </div>

        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5 space-y-2 text-xs text-zinc-600">
          <div className="flex items-center gap-1.5 font-bold text-zinc-800">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shift Handover Guide</span>
          </div>
          <p>
            Night handover occurs at 10:00 PM. Reconcile seated guest receipts and audit cash drawer before logging out.
          </p>
        </div>

        <Button variant="primary" onClick={onClose} fullWidth className="bg-[#181A1E]">
          Done
        </Button>
      </div>
    </Modal>
  );
};
