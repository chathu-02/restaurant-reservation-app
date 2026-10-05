import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/layout/StatusBar';
import { BottomNavBar } from '../components/layout/BottomNavBar';
import { HomeIndicator } from '../components/layout/HomeIndicator';
import { MetricCard } from '../components/dashboard/MetricCard';
import { RushAlertCard } from '../components/dashboard/RushAlertCard';
import { ActionButtons } from '../components/dashboard/ActionButtons';
import { ManagerTools } from '../components/dashboard/ManagerTools';
import { NewBookingModal } from '../components/dashboard/NewBookingModal';
import { WalkInModal } from '../components/dashboard/WalkInModal';
import { RushSlotsModal } from '../components/dashboard/RushSlotsModal';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, Grid3X3, XCircle, Clock } from 'lucide-react';
import staffAvatar from '../assets/staff_avatar.jpg';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState(() => dashboardService.getMetrics());
  const [rushInfo] = useState(() => dashboardService.getRushAlert());

  // Modals state
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [isRushSlotsOpen, setIsRushSlotsOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const refreshMetrics = () => {
    setMetrics(dashboardService.getMetrics());
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F6F9F8] min-h-full">
      {/* Top Content Area */}
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Top Header: Shift pill on left, Avatar on right */}
        <div className="flex items-center justify-between mt-1 mb-4">
          {/* Dinner Service Pill */}
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FAF0] border border-emerald-200/50">
              <span className="w-2 h-2 rounded-full bg-[#00B37E] animate-pulse" />
              <span className="text-xs font-bold text-[#009669]">
                {metrics.serviceName}
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-400">
              • {metrics.shiftName}
            </span>
          </div>

          {/* User Avatar with Status Dot */}
          <button
            onClick={() => navigate('/profile')}
            className="relative select-none cursor-pointer focus:outline-none transition active:scale-95"
            title="View Profile & Settings"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-zinc-200">
              <img
                src={staffAvatar}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256';
                }}
              />
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                user.isOnShift ? 'bg-[#00B37E]' : 'bg-zinc-400'
              }`}
            />
          </button>
        </div>

        {/* Date & Title */}
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            Today
          </h1>
          <p className="text-xs font-semibold text-zinc-400 mt-0.5">
            {metrics.dateFormatted}
          </p>
        </div>

        {/* 2x2 Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* 1. Reservations Today */}
          <MetricCard
            icon={<Calendar className="w-5 h-5 text-[#009669]" />}
            iconBgClass="bg-[#E8FAF0]"
            badge={
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF0] text-[#00875A]">
                {metrics.reservationsChange}
              </span>
            }
            value={metrics.reservationsToday}
            label="Reservations today"
            onClick={() => setIsNewBookingOpen(true)}
          />

          {/* 2. Guests in Queue */}
          <MetricCard
            icon={<Users className="w-5 h-5 text-[#6366F1]" />}
            iconBgClass="bg-[#EEF2FF]"
            badge={
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
                {metrics.queueWaitTime}
              </span>
            }
            value={metrics.guestsInQueue}
            label="Guests in queue"
            onClick={() => setIsWalkInOpen(true)}
          />

          {/* 3. Tables Occupied */}
          <MetricCard
            icon={<Grid3X3 className="w-5 h-5 text-[#EA580C]" />}
            iconBgClass="bg-[#FFF7ED]"
            badge={
              <div className="w-12 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="bg-[#EA580C] h-full rounded-full"
                  style={{
                    width: `${Math.round(
                      (metrics.tablesOccupied / metrics.tablesTotal) * 100
                    )}%`,
                  }}
                />
              </div>
            }
            value={
              <span>
                {metrics.tablesOccupied}
                <span className="text-zinc-400 text-lg font-medium">
                  /{metrics.tablesTotal}
                </span>
              </span>
            }
            label="Tables occupied"
            onClick={() => navigate('/profile')}
          />

          {/* 4. No-shows */}
          <MetricCard
            icon={<XCircle className="w-5 h-5 text-[#EF4444]" />}
            iconBgClass="bg-[#FEF2F2]"
            badge={
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8FAF0] text-[#00875A]">
                {metrics.noShowsLevel}
              </span>
            }
            value={metrics.noShows}
            label="No-shows"
          />
        </div>

        {/* Rush Alert Banner */}
        <RushAlertCard
          time={rushInfo.time}
          coversReserved={rushInfo.coversReserved}
          capacityPercent={rushInfo.capacityPercent}
          onViewSlots={() => setIsRushSlotsOpen(true)}
        />

        {/* Action Buttons Row */}
        <ActionButtons
          onWalkIn={() => setIsWalkInOpen(true)}
          onNewBooking={() => setIsNewBookingOpen(true)}
          onManage={() => setIsManageModalOpen(true)}
        />

        {/* Manager Tools */}
        <ManagerTools onOpenSettings={() => setIsSettingsModalOpen(true)} />
      </div>

      {/* Bottom Sticky Section */}
      <div className="w-full shrink-0">
        <BottomNavBar />
        <HomeIndicator />
      </div>

      {/* Modals */}
      <NewBookingModal
        isOpen={isNewBookingOpen}
        onClose={() => setIsNewBookingOpen(false)}
        onBookingCreated={refreshMetrics}
      />

      <WalkInModal
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        onWalkInAdded={refreshMetrics}
      />

      <RushSlotsModal
        isOpen={isRushSlotsOpen}
        onClose={() => setIsRushSlotsOpen(false)}
      />

      {/* Manage Modal */}
      <Modal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        title="Shift Management Actions"
        subtitle="Quick overrides for current dinner service"
      >
        <div className="space-y-3">
          <button
            onClick={() => {
              setIsManageModalOpen(false);
              navigate('/staff');
            }}
            className="w-full text-left p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition"
          >
            <div>
              <div className="text-xs font-bold text-zinc-900">Manage Staff Roster</div>
              <div className="text-[11px] text-zinc-500">Edit duty status and add team members</div>
            </div>
            <Users className="w-4 h-4 text-zinc-400" />
          </button>

          <button
            onClick={() => {
              setIsManageModalOpen(false);
              setIsRushSlotsOpen(true);
            }}
            className="w-full text-left p-3.5 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between transition"
          >
            <div>
              <div className="text-xs font-bold text-zinc-900">Table Capacity Forecast</div>
              <div className="text-[11px] text-zinc-500">Review 7:30 PM peak rush arrival slots</div>
            </div>
            <Clock className="w-4 h-4 text-zinc-400" />
          </button>

          <Button variant="primary" onClick={() => setIsManageModalOpen(false)} fullWidth className="bg-[#181A1E] mt-2">
            Done
          </Button>
        </div>
      </Modal>

      {/* Restaurant Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Restaurant Settings"
        subtitle="Operating hours and table turnaround"
      >
        <div className="space-y-3 text-xs text-zinc-700">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
            <strong>Dinner Service Window:</strong> 5:30 PM - 11:00 PM
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
            <strong>Standard Table Turnaround:</strong> 75 minutes
          </div>
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80">
            <strong>Grace Period for No-shows:</strong> 15 minutes
          </div>
          <Button variant="primary" onClick={() => setIsSettingsModalOpen(false)} fullWidth className="bg-[#181A1E] mt-2">
            Close Settings
          </Button>
        </div>
      </Modal>
    </div>
  );
};
