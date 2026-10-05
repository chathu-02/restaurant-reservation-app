import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Calendar, Grid3X3, Users, Bell } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const currentPath = location.pathname;

  const handleTabClick = (path: string, label: string) => {
    if (path === '/dashboard') {
      navigate('/dashboard');
    } else if (path === '/staff') {
      navigate('/staff');
    } else {
      showToast(`${label} view is synchronized with operational live feed`, 'info');
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-[#EEF2F0] px-3 pt-2 pb-1 shrink-0">
      <div className="flex items-center justify-around">
        {/* 1. Dashboard */}
        <button
          onClick={() => handleTabClick('/dashboard', 'Dashboard')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/dashboard'
              ? 'bg-[#E8FAF0] text-[#009669]'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-bold tracking-tight">Dashboard</span>
        </button>

        {/* 2. Reservations */}
        <button
          onClick={() => handleTabClick('/reservations', 'Reservations')}
          className="flex flex-col items-center py-1 px-2.5 rounded-2xl text-zinc-400 hover:text-zinc-700 transition"
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">Reservations</span>
        </button>

        {/* 3. Tables */}
        <button
          onClick={() => handleTabClick('/tables', 'Tables')}
          className="flex flex-col items-center py-1 px-2.5 rounded-2xl text-zinc-400 hover:text-zinc-700 transition"
        >
          <Grid3X3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">Tables</span>
        </button>

        {/* 4. Queue */}
        <button
          onClick={() => handleTabClick('/queue', 'Queue')}
          className="flex flex-col items-center py-1 px-2.5 rounded-2xl text-zinc-400 hover:text-zinc-700 transition"
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium">Queue</span>
        </button>

        {/* 5. Alerts */}
        <button
          onClick={() => handleTabClick('/alerts', 'Alerts')}
          className="relative flex flex-col items-center py-1 px-2.5 rounded-2xl text-zinc-400 hover:text-zinc-700 transition"
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
          </div>
          <span className="text-[11px] font-medium">Alerts</span>
        </button>
      </div>
    </div>
  );
};
