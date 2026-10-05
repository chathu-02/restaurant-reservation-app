import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/layout/StatusBar';
import { CustomerBottomNav } from '../../components/layout/CustomerBottomNav';
import { HomeIndicator } from '../../components/layout/HomeIndicator';
import { useCustomer } from '../../context/CustomerContext';
import { MenuSpecialsModal } from '../../components/customer/MenuSpecialsModal';
import { LeaveQueueConfirmModal } from '../../components/customer/LeaveQueueConfirmModal';
import {
  ChevronLeft,
  Bell,
  Clock,
  Zap,
  Users,
  Armchair,
  LogOut,
  UtensilsCrossed,
} from 'lucide-react';

export const YourQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { queueStatus, leaveQueue } = useCustomer();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // If user has not joined, default to active demo tracking or allow quick join
  const queue = queueStatus || {
    position: 3,
    queueNumber: '#3',
    restaurantName: 'The Green Terrace',
    restaurantLocation: 'Riverside Ave',
    estimatedWaitMin: 15,
    initialWaitMin: 25,
    tablesAhead: 2,
    turnoverPace: 'Fast (~4 min/table)',
    partySize: 2,
    joinedTime: '6:40 PM',
    seatingPreference: 'Indoor',
    floorStatus: 'Table clearing in progress',
    lastUpdated: 'Just now',
  };

  const handleConfirmLeave = async () => {
    await leaveQueue();
    navigate('/join-queue');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F2FBF7] via-[#F6F9F8] to-[#F6F9F8] min-h-full">
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Top Header */}
        <div className="flex items-center justify-between mt-2 mb-3.5">
          <button
            onClick={() => navigate('/join-queue')}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold text-zinc-900 tracking-tight flex items-center justify-center gap-1.5">
              <span>Your Queue</span>
              <span className="w-2 h-2 rounded-full bg-[#00B37E] inline-block animate-pulse" />
            </h1>
            <p className="text-xs font-semibold text-zinc-400 mt-0.5">
              {queue.restaurantName} • {queue.restaurantLocation}
            </p>
          </div>

          <button
            onClick={() => navigate('/alerts')}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs relative active:scale-95 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00B37E] ring-2 ring-white" />
          </button>
        </div>

        {/* Main Queue Tracker Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#EEF2F0] shadow-soft text-center relative mb-3.5">
          {/* Live Tracker Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FAF0] border border-emerald-200/50 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00B37E] animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#00875A] uppercase">
              LIVE QUEUE TRACKER
            </span>
          </div>

          {/* Large Position Number */}
          <div className="relative inline-block my-1">
            <span className="text-6xl font-extrabold text-[#111827] tracking-tight leading-none">
              {queue.position}
            </span>
            <span className="absolute -top-1 -right-7 bg-[#E8FAF0] text-[#00875A] text-[11px] font-extrabold px-1.5 py-0.5 rounded-md">
              {queue.queueNumber}
            </span>
          </div>
          <p className="text-xs font-semibold text-zinc-400 mb-3.5">Your position in line</p>

          {/* Wait Time Pill */}
          <div className="inline-flex items-center gap-2 bg-[#181A1E] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-sm mb-4">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estimated wait ~{queue.estimatedWaitMin} min</span>
          </div>

          {/* Progress Bar Container */}
          <div className="bg-zinc-50 rounded-2xl p-3.5 border border-zinc-100">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-[#009669]">{queue.tablesAhead} tables ahead</span>
              <span className="text-zinc-400 font-medium">Initial wait: {queue.initialWaitMin}m</span>
            </div>

            <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mb-2.5">
              <div className="bg-[#00B37E] h-full rounded-full w-[65%]" />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#00875A]">
              <Zap className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
              <span>Turnover pace: {queue.turnoverPace}</span>
            </div>
          </div>
        </div>

        {/* 3 Detail Cards in a Row */}
        <div className="grid grid-cols-3 gap-2.5 mb-3.5">
          {/* Party */}
          <div className="bg-white rounded-3xl p-3 border border-[#EEF2F0] shadow-soft text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-0.5">
              PARTY
            </span>
            <span className="text-xs font-extrabold text-zinc-900">{queue.partySize} Guests</span>
          </div>

          {/* Joined */}
          <div className="bg-white rounded-3xl p-3 border border-[#EEF2F0] shadow-soft text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-0.5">
              JOINED
            </span>
            <span className="text-xs font-extrabold text-zinc-900">{queue.joinedTime}</span>
          </div>

          {/* Seating */}
          <div className="bg-white rounded-3xl p-3 border border-[#EEF2F0] shadow-soft text-center flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E8FAF0] text-[#009669] flex items-center justify-center mb-1">
              <Armchair className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 mb-0.5">
              SEATING
            </span>
            <span className="text-xs font-extrabold text-zinc-900">{queue.seatingPreference}</span>
          </div>
        </div>

        {/* We'll alert you banner */}
        <div className="bg-[#E8FAF0] border border-emerald-200/60 rounded-3xl p-4 shadow-soft mb-3.5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#009669] flex items-center justify-center shrink-0 shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-zinc-900">
                  We'll alert you when ready
                </span>
                <span className="bg-[#00B37E] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                  SMS
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">
                Please stay within <strong>5 minutes</strong> of the restaurant. You'll receive a ready chime and text message.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold pt-3 mt-3 border-t border-emerald-200/50">
            <div className="flex items-center gap-1.5 text-[#00875A]">
              <span className="w-2 h-2 rounded-full bg-[#00B37E]" />
              <span>Floor status: {queue.floorStatus}</span>
            </div>
            <span className="text-zinc-400 font-normal">{queue.lastUpdated}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-full bg-[#181A1E] hover:bg-zinc-800 active:scale-[0.98] transition-all text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md"
          >
            <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
            <span>Explore Menu & Daily Specials</span>
          </button>

          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="w-full bg-[#FFF5F5] hover:bg-[#FEE2E2] active:scale-[0.98] border border-[#FED7D7] transition-all text-[#E53E3E] font-bold text-xs sm:text-sm py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-[#E53E3E]" />
            <span>Leave Queue</span>
          </button>
        </div>
      </div>

      {/* Bottom Sticky Customer Nav & Indicator */}
      <div className="w-full shrink-0">
        <CustomerBottomNav />
        <HomeIndicator />
      </div>

      {/* Modals */}
      <MenuSpecialsModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <LeaveQueueConfirmModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleConfirmLeave}
        position={queue.position}
      />
    </div>
  );
};
