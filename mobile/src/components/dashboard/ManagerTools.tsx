import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Settings, ChevronRight } from 'lucide-react';
import { useStaff } from '../../context/StaffContext';

interface ManagerToolsProps {
  onOpenSettings?: () => void;
}

export const ManagerTools: React.FC<ManagerToolsProps> = ({ onOpenSettings }) => {
  const navigate = useNavigate();
  const { activeCount } = useStaff();

  return (
    <div className="mt-3 mb-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h2 className="text-sm font-bold text-zinc-900 tracking-tight">Manager tools</h2>
        <button
          onClick={onOpenSettings || (() => navigate('/profile'))}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-600 transition"
        >
          Settings & config
        </button>
      </div>

      {/* Tool items container */}
      <div className="bg-white rounded-3xl border border-[#EEF2F0] shadow-soft overflow-hidden divide-y divide-[#EEF2F0]">
        {/* 1. Staff Accounts */}
        <div
          onClick={() => navigate('/staff')}
          className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#6366F1] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">Staff Accounts</div>
              <div className="text-xs text-zinc-400 font-medium">
                {activeCount} active on duty
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300" />
        </div>

        {/* 2. Restaurant Settings */}
        <div
          onClick={onOpenSettings || (() => navigate('/profile'))}
          className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8FAF0] text-[#009669] flex items-center justify-center shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900">Restaurant Settings</div>
              <div className="text-xs text-zinc-400 font-medium">
                Operating hours & policies
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-300" />
        </div>
      </div>
    </div>
  );
};
