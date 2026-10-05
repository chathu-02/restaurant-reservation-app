import React from 'react';
import { Wifi, Battery, Signal, Headphones } from 'lucide-react';

interface StatusBarProps {
  showHeadset?: boolean;
  time?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  showHeadset = false,
  time = '9:41',
}) => {
  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-zinc-900 select-none text-xs font-semibold">
      <span className="font-bold tracking-tight text-sm">{time}</span>

      <div className="flex items-center gap-1.5 text-zinc-800">
        {showHeadset && <Headphones className="w-3.5 h-3.5 mr-0.5 text-zinc-600" />}
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center">
          <Battery className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
