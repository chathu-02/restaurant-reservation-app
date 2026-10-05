import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, Bell, User } from 'lucide-react';
import { useCustomer } from '../../context/CustomerContext';

export const CustomerBottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { unreadCount, queueStatus } = useCustomer();

  const currentPath = location.pathname;

  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-[#EEF2F0] px-2 pt-2 pb-1 shrink-0">
      <div className="flex items-center justify-around">
        {/* 1. Home */}
        <button
          onClick={() => navigate('/join-queue')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/join-queue'
              ? 'text-[#009669]'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* 2. Bookings */}
        <button
          onClick={() => navigate('/customer-profile')}
          className={`flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/bookings'
              ? 'text-[#009669]'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Calendar className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Bookings</span>
        </button>

        {/* 3. Queue */}
        <button
          onClick={() => navigate('/queue')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/queue'
              ? 'text-[#009669] font-bold'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <div className="relative">
            <Clock className="w-5 h-5 mb-0.5" />
            {queueStatus && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00B37E] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] font-medium">Queue</span>
        </button>

        {/* 4. Alerts */}
        <button
          onClick={() => navigate('/alerts')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/alerts'
              ? 'text-[#009669] font-bold'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <div className="relative">
            <Bell className="w-5 h-5 mb-0.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00B37E] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => navigate('/customer-profile')}
          className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all ${
            currentPath === '/customer-profile'
              ? 'text-[#009669] font-bold'
              : 'text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-medium">Profile</span>
          {currentPath === '/customer-profile' && (
            <span className="w-1 h-1 rounded-full bg-[#009669] mt-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
