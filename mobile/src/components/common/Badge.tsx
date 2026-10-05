import React from 'react';
import { StaffRole } from '../../types';

interface RoleBadgeProps {
  role: StaffRole | string;
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, className = '' }) => {
  const normalized = role.toUpperCase();

  switch (normalized) {
    case 'MANAGER':
      return (
        <span
          className={`inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#EEF2FF] text-[#4F46E5] uppercase ${className}`}
        >
          MANAGER
        </span>
      );
    case 'KITCHEN':
      return (
        <span
          className={`inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#FFF7ED] text-[#EA580C] uppercase ${className}`}
        >
          KITCHEN
        </span>
      );
    case 'STAFF':
    default:
      return (
        <span
          className={`inline-flex items-center text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#4B5563] uppercase ${className}`}
        >
          STAFF
        </span>
      );
  }
};

interface StatusPillProps {
  dotColor?: 'green' | 'amber' | 'gray' | 'red';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  dotColor = 'green',
  pulse = false,
  children,
  className = '',
  onClick,
}) => {
  const dotClasses = {
    green: 'bg-[#10B981]',
    amber: 'bg-[#F59E0B]',
    gray: 'bg-[#9CA3AF]',
    red: 'bg-[#EF4444]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold select-none ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-95 transition' : ''
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotClasses[dotColor]}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${dotClasses[dotColor]}`} />
      </span>
      <span>{children}</span>
    </div>
  );
};
