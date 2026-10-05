import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/layout/StatusBar';
import { CustomerBottomNav } from '../../components/layout/CustomerBottomNav';
import { HomeIndicator } from '../../components/layout/HomeIndicator';
import { useCustomer } from '../../context/CustomerContext';
import { EditCustomerProfileModal } from '../../components/customer/EditCustomerProfileModal';
import { CustomerPasswordModal } from '../../components/customer/CustomerPasswordModal';
import { PaymentMethodsModal } from '../../components/customer/PaymentMethodsModal';
import { LogoutConfirmModal } from '../../components/customer/LogoutConfirmModal';
import {
  Edit3,
  Camera,
  User,
  Lock,
  CreditCard,
  Bell,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  LogOut,
} from 'lucide-react';

export const CustomerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    profile,
    updateProfile,
    toggleReminders,
    toggleQueueAlerts,
    logoutCustomer,
  } = useCustomer();

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isNotifSettingsExpanded, setIsNotifSettingsExpanded] = useState(true);

  const handleLogoutConfirm = () => {
    logoutCustomer();
    navigate('/join-queue');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F2FBF7] via-[#F6F9F8] to-[#F6F9F8] min-h-full">
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Top Header */}
        <div className="flex items-center justify-between mt-3 mb-3">
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
            Profile
          </h1>

          <button
            onClick={() => setIsEditOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-700 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card / Header */}
        <div className="bg-white rounded-3xl p-5 border border-[#EEF2F0] shadow-soft text-center mb-4 relative">
          {/* Avatar with Camera Overlay */}
          <div className="relative inline-block mt-1 mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-emerald-100 shadow-sm mx-auto bg-zinc-100">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256';
                }}
              />
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#181A1E] text-white flex items-center justify-center shadow-md hover:bg-zinc-800 transition"
              title="Change Photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-lg font-extrabold text-zinc-900 tracking-tight">
            {profile.name}
          </h2>
          <p className="text-xs text-zinc-400 font-medium mt-0.5">{profile.email}</p>

          {/* Preferred Guest Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8FAF0] border border-emerald-200/50 mt-2.5">
            <span className="w-2 h-2 rounded-full bg-[#00B37E]" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#00875A] uppercase">
              {profile.statusBadge}
            </span>
          </div>

          {/* 3 Stats Columns */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#EEF2F0]">
            <div>
              <div className="text-base font-extrabold text-zinc-900">
                {profile.bookingsCount}
              </div>
              <div className="text-[11px] font-medium text-zinc-400">Bookings</div>
            </div>

            <div className="border-x border-[#EEF2F0]">
              <div className="text-base font-extrabold text-zinc-900">
                {profile.queueSaves}
              </div>
              <div className="text-[11px] font-medium text-zinc-400">Queue Saves</div>
            </div>

            <div>
              <div className="text-base font-extrabold text-[#00B37E]">
                {profile.points}
              </div>
              <div className="text-[11px] font-medium text-zinc-400">Points</div>
            </div>
          </div>
        </div>

        {/* Section 1: ACCOUNT */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            ACCOUNT
          </div>

          <div className="bg-white rounded-3xl border border-[#EEF2F0] shadow-soft overflow-hidden divide-y divide-[#EEF2F0]">
            {/* 1. Edit personal details */}
            <div
              onClick={() => setIsEditOpen(true)}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F4FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-zinc-900">
                  Edit personal details
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>

            {/* 2. Change password */}
            <div
              onClick={() => setIsPasswordOpen(true)}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F4FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-zinc-900">
                  Change password
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>

            {/* 3. Payment methods */}
            <div
              onClick={() => setIsPaymentOpen(true)}
              className="flex items-center justify-between p-3.5 hover:bg-zinc-50 active:bg-zinc-100 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F4FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-zinc-900">
                    Payment methods
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium">
                    {profile.defaultPayment}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-300" />
            </div>
          </div>
        </div>

        {/* Section 2: PREFERENCES */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            PREFERENCES
          </div>

          <div className="bg-white rounded-3xl border border-[#EEF2F0] shadow-soft overflow-hidden">
            {/* Header / Accordion trigger */}
            <div
              onClick={() => setIsNotifSettingsExpanded(!isNotifSettingsExpanded)}
              className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-zinc-50 transition border-b border-zinc-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#F0F4FF] text-[#4F46E5] flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-zinc-900">
                  Notification settings
                </span>
              </div>
              {isNotifSettingsExpanded ? (
                <ChevronUp className="w-4 h-4 text-zinc-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>

            {/* Expanded items */}
            {isNotifSettingsExpanded && (
              <div className="divide-y divide-[#EEF2F0] bg-zinc-50/50">
                {/* Reminders */}
                <div className="flex items-center justify-between p-3.5 pl-6">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Reminders</div>
                    <div className="text-[11px] text-zinc-400">
                      Upcoming bookings 2h & 24h prior
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleReminders}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                      profile.remindersEnabled ? 'bg-[#009669]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        profile.remindersEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Queue alerts */}
                <div className="flex items-center justify-between p-3.5 pl-6">
                  <div>
                    <div className="text-xs font-bold text-zinc-900">Queue alerts</div>
                    <div className="text-[11px] text-zinc-400">
                      Position changes and table calls
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleQueueAlerts}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                      profile.queueAlertsEnabled ? 'bg-[#009669]' : 'bg-[#D1D5DB]'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        profile.queueAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* DEVELOPED LOGOUT BUTTON (Explicitly requested by USER) */}
        <div className="mt-5 mb-3">
          <button
            onClick={() => setIsLogoutOpen(true)}
            className="w-full bg-[#FFF5F5] hover:bg-[#FEE2E2] active:scale-[0.98] border border-[#FED7D7] transition-all text-[#E53E3E] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-[#E53E3E]" />
            <span>Log Out of Account</span>
          </button>
        </div>
      </div>

      {/* Bottom Sticky Customer Nav & Indicator */}
      <div className="w-full shrink-0">
        <CustomerBottomNav />
        <HomeIndicator />
      </div>

      {/* Modals */}
      <EditCustomerProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        profile={profile}
        onSave={updateProfile}
      />

      <CustomerPasswordModal
        isOpen={isPasswordOpen}
        onClose={() => setIsPasswordOpen(false)}
      />

      <PaymentMethodsModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        defaultPayment={profile.defaultPayment}
      />

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
        userName={profile.name}
      />
    </div>
  );
};
