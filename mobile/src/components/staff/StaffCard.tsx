import React from 'react';
import { StaffMember } from '../../types';
import { RoleBadge } from '../common/Badge';
import { ToggleSwitch } from '../common/ToggleSwitch';
import { Edit3, Trash2 } from 'lucide-react';

interface StaffCardProps {
  member: StaffMember;
  onToggleDuty: (id: string) => void;
  onEdit: (member: StaffMember) => void;
  onDelete: (member: StaffMember) => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  member,
  onToggleDuty,
  onEdit,
  onDelete,
}) => {
  const avatarBgMap = {
    purple: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
    orange: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
    gray: 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700',
    emerald: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    blue: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-[#EEF2F0] shadow-soft flex items-center justify-between gap-3 transition-all hover:border-zinc-300 group">
      {/* Left side: Avatar + Info */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar with Status Dot */}
        <div className="relative shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm select-none shadow-xs ${
              avatarBgMap[member.avatarColor] || avatarBgMap.purple
            }`}
          >
            {member.initials}
          </div>
          {/* Status Dot */}
          <span
            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
              member.isOnDuty ? 'bg-[#00B37E]' : 'bg-[#9CA3AF]'
            }`}
          />
        </div>

        {/* Member Details */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-zinc-900 truncate">
              {member.name}
            </span>
            <RoleBadge role={member.role} />
          </div>

          <div className="text-[11px] text-zinc-400 font-medium truncate mt-0.5">
            {member.staffCode} • {member.department}
          </div>

          {/* Toggle Switch */}
          <div className="mt-2">
            <ToggleSwitch
              checked={member.isOnDuty}
              onChange={() => onToggleDuty(member.id)}
              labelOn="On duty"
              labelOff="Off duty"
            />
          </div>
        </div>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onEdit(member)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
          title="Edit Staff Member"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(member)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition"
          title="Delete Staff Member"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
