import React from 'react';
import { UserProfile } from '../../types';
import { Camera, Star } from 'lucide-react';
import staffAvatar from '../../assets/staff_avatar.jpg';

interface ProfileHeroCardProps {
  user: UserProfile;
  onToggleShift: () => void;
  onEditAvatar?: () => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({
  user,
  onToggleShift,
  onEditAvatar,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EEF2F0] shadow-soft relative text-center">
      {/* Shift Badge on Top Right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onToggleShift}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition active:scale-95 ${
            user.isOnShift
              ? 'bg-[#E8FAF0] text-[#009669] border border-emerald-200/50'
              : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
          }`}
          title="Click to toggle Shift Status"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              user.isOnShift ? 'bg-[#009669]' : 'bg-zinc-400'
            }`}
          />
          <span>{user.isOnShift ? 'On Shift' : 'Off Shift'}</span>
        </button>
      </div>

      {/* Avatar with Camera badge */}
      <div className="relative inline-block mt-1 mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-emerald-50/80 shadow-sm mx-auto bg-zinc-100">
          <img
            src={staffAvatar}
            alt={user.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // fallback if image fails
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256';
            }}
          />
        </div>
        <button
          onClick={onEditAvatar}
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#181A1E] text-white flex items-center justify-center shadow-md hover:bg-zinc-800 transition"
          title="Change Profile Photo"
        >
          <Camera className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Name and Email */}
      <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
        {user.name}
      </h2>
      <p className="text-xs text-zinc-400 font-medium mt-0.5">{user.email}</p>

      {/* Role and Shift Pills */}
      <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5]">
          {user.role}
        </span>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F3F4F6] text-[#4B5563]">
          {user.shiftInfo}
        </span>
      </div>

      {/* 3 Stats Columns */}
      <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#EEF2F0]">
        {/* Rating */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
            RATING
          </span>
          <div className="flex items-center gap-1 text-sm font-extrabold text-zinc-900">
            <span>{user.rating}</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center border-x border-[#EEF2F0]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
            COMPLETED
          </span>
          <span className="text-sm font-extrabold text-zinc-900">
            {user.completedShifts} Shifts
          </span>
        </div>

        {/* Floor */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-0.5">
            FLOOR
          </span>
          <span className="text-sm font-extrabold text-zinc-900">
            {user.floor}
          </span>
        </div>
      </div>
    </div>
  );
};
