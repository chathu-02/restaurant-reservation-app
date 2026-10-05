import React from 'react';
import { ChevronRight } from 'lucide-react';

interface SettingRowProps {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  onClick?: () => void;
}

export const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  iconBgClass,
  title,
  subtitle,
  badge,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBgClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-zinc-900 truncate">{title}</div>
          <div className="text-xs text-zinc-400 font-medium truncate mt-0.5">
            {subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge}
        <ChevronRight className="w-4 h-4 text-zinc-300" />
      </div>
    </div>
  );
};
