import React from 'react';
import { UserPlus, Plus, LayoutGrid } from 'lucide-react';

interface ActionButtonsProps {
  onWalkIn: () => void;
  onNewBooking: () => void;
  onManage: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onWalkIn,
  onNewBooking,
  onManage,
}) => {
  return (
    <div className="grid grid-cols-12 gap-2.5 my-3 items-center">
      {/* 1. Walk-in */}
      <button
        onClick={onWalkIn}
        className="col-span-4 bg-white hover:bg-zinc-50 border border-[#EEF2F0] active:scale-[0.97] transition-all rounded-3xl py-3.5 px-3 flex items-center justify-center gap-1.5 shadow-soft text-zinc-800 text-xs sm:text-sm font-bold"
      >
        <UserPlus className="w-4 h-4 text-zinc-500 shrink-0" />
        <span>Walk-in</span>
      </button>

      {/* 2. New Booking (Prominent Center) */}
      <button
        onClick={onNewBooking}
        className="col-span-4 bg-[#181A1E] hover:bg-zinc-800 active:scale-[0.97] transition-all text-white rounded-3xl py-3.5 px-3 flex items-center justify-center gap-1.5 shadow-md text-xs sm:text-sm font-bold"
      >
        <Plus className="w-4 h-4 text-white shrink-0" />
        <span className="truncate">New Booking</span>
      </button>

      {/* 3. Manage */}
      <button
        onClick={onManage}
        className="col-span-4 bg-white hover:bg-zinc-50 border border-[#EEF2F0] active:scale-[0.97] transition-all rounded-3xl py-3.5 px-3 flex items-center justify-center gap-1.5 shadow-soft text-zinc-800 text-xs sm:text-sm font-bold"
      >
        <LayoutGrid className="w-4 h-4 text-zinc-500 shrink-0" />
        <span>Manage</span>
      </button>
    </div>
  );
};
