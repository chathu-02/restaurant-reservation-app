import React from 'react';
import { Clock } from 'lucide-react';

interface RushAlertCardProps {
  time: string;
  coversReserved: number;
  capacityPercent: number;
  onViewSlots: () => void;
}

export const RushAlertCard: React.FC<RushAlertCardProps> = ({
  time,
  coversReserved,
  capacityPercent,
  onViewSlots,
}) => {
  return (
    <div className="bg-[#FFF8EE] border border-[#FED7AA]/60 rounded-3xl p-3.5 flex items-center justify-between gap-3 shadow-soft my-3">
      {/* Icon */}
      <div className="w-10 h-10 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shrink-0">
        <Clock className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-zinc-900 leading-tight">
          <span>Rush expected {time}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
        </div>
        <div className="text-[11px] sm:text-xs text-amber-900/80 font-medium truncate mt-0.5">
          {coversReserved} covers reserved ({capacityPercent}% cap)
        </div>
      </div>

      {/* Action */}
      <button
        onClick={onViewSlots}
        className="shrink-0 bg-[#FDF0DB] hover:bg-[#FBE5C3] active:scale-95 text-[#9A3412] text-xs font-bold px-3.5 py-2 rounded-full transition-all"
      >
        View slots
      </button>
    </div>
  );
};
