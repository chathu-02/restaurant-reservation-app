import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  iconBgClass: string;
  badge?: React.ReactNode;
  value: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconBgClass,
  badge,
  value,
  label,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-4 border border-[#EEF2F0] shadow-soft flex flex-col justify-between transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-zinc-300 hover:shadow-md active:scale-[0.98]' : ''
      }`}
    >
      {/* Top row: icon and badge */}
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass}`}
        >
          {icon}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {/* Main value and label */}
      <div>
        <div className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-none mb-1">
          {value}
        </div>
        <div className="text-xs font-medium text-zinc-400">{label}</div>
      </div>
    </div>
  );
};
