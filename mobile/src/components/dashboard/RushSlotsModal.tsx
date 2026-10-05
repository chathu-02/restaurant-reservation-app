import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { dashboardService } from '../../services/dashboardService';
import { Clock, Users, AlertTriangle, CheckCircle } from 'lucide-react';

interface RushSlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RushSlotsModal: React.FC<RushSlotsModalProps> = ({ isOpen, onClose }) => {
  const alertInfo = dashboardService.getRushAlert();
  const { details } = alertInfo;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upcoming Dinner Rush"
      subtitle="Capacity analysis & slot management"
    >
      <div className="flex flex-col gap-4">
        {/* Highlight box */}
        <div className="bg-[#FFF8EE] border border-[#FED7AA] rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Peak Window: {details.peakRange}</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            {details.totalCovers} total covers expected across {details.reservationsCount} reservations and {details.queueCount} queue entries (88% room capacity).
          </p>
        </div>

        {/* Time Slots Utilization */}
        <div>
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
            Slot Capacity Breakdown
          </h4>
          <div className="space-y-2">
            {details.timeSlots.map((slot) => {
              const pct = Math.round((slot.tablesBooked / slot.totalTables) * 100);
              const isPeak = pct >= 80;
              return (
                <div
                  key={slot.time}
                  className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs"
                >
                  <span className="font-semibold text-zinc-800 w-28 shrink-0">
                    {slot.time}
                  </span>
                  <div className="flex-1 bg-zinc-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isPeak ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="font-bold text-zinc-600 w-12 text-right">
                    {slot.tablesBooked}/{slot.totalTables}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Recommendations */}
        <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3.5">
          <h4 className="text-xs font-bold text-zinc-800 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Floor Management Checklist
          </h4>
          <ul className="space-y-1.5">
            {details.recommendations.map((rec, i) => (
              <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button variant="primary" onClick={onClose} fullWidth className="mt-1 bg-[#181A1E]">
          Acknowledge & Close
        </Button>
      </div>
    </Modal>
  );
};
