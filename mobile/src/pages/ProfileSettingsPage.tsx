import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/layout/StatusBar';
import { HomeIndicator } from '../components/layout/HomeIndicator';
import { ProfileHeroCard } from '../components/profile/ProfileHeroCard';
import { SettingRow } from '../components/profile/SettingRow';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import { SecurityModal } from '../components/profile/SecurityModal';
import { TableMapModal } from '../components/profile/TableMapModal';
import { HelpModal } from '../components/profile/HelpModal';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  Edit3,
  User,
  Lock,
  Bell,
  LayoutGrid,
  HelpCircle,
  LogOut,
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, toggleShift, toggleAlertsSound, updateProfile, logout } = useAuth();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isTableMapOpen, setIsTableMapOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F6F9F8] min-h-full">
      {/* Top Main Section */}
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status Bar */}
        <StatusBar time="9:41" />

        {/* Top Header: Back Button, Title + Staff ID, Edit Button */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          <div className="text-center">
            <h1 className="text-base sm:text-lg font-extrabold text-zinc-900 tracking-tight">
              Profile & Settings
            </h1>
            <p className="text-xs font-semibold text-zinc-400 mt-0.5">
              Staff ID {user.staffId}
            </p>
          </div>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Hero Card */}
        <ProfileHeroCard
          user={user}
          onToggleShift={toggleShift}
          onEditAvatar={() => setIsEditProfileOpen(true)}
        />

        {/* Section 1: ACCOUNT & SECURITY */}
        <div className="mt-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            ACCOUNT & SECURITY
          </div>

          <div className="bg-white rounded-3xl border border-[#EEF2F0] shadow-soft overflow-hidden divide-y divide-[#EEF2F0]">
            {/* 1. Personal Details */}
            <SettingRow
              icon={<User className="w-5 h-5" />}
              iconBgClass="bg-[#EEF2FF] text-[#6366F1]"
              title="Personal Details"
              subtitle="Name, mobile & contact info"
              onClick={() => setIsEditProfileOpen(true)}
            />

            {/* 2. Security & Passcode */}
            <SettingRow
              icon={<Lock className="w-5 h-5" />}
              iconBgClass="bg-[#FFF7ED] text-[#EA580C]"
              title="Security & Passcode"
              subtitle="Change PIN, password & biometric"
              onClick={() => setIsSecurityOpen(true)}
            />

            {/* 3. Shift Alerts & Sound */}
            <SettingRow
              icon={<Bell className="w-5 h-5" />}
              iconBgClass="bg-[#E8FAF0] text-[#009669]"
              title="Shift Alerts & Sound"
              subtitle="Order pings & kitchen bell"
              badge={
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    user.alertsAndSound
                      ? 'bg-[#E8FAF0] text-[#00875A]'
                      : 'bg-zinc-100 text-zinc-400'
                  }`}
                >
                  {user.alertsAndSound ? 'On' : 'Off'}
                </span>
              }
              onClick={toggleAlertsSound}
            />
          </div>
        </div>

        {/* Section 2: PREFERENCES & SUPPORT */}
        <div className="mt-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-1 mb-2">
            PREFERENCES & SUPPORT
          </div>

          <div className="bg-white rounded-3xl border border-[#EEF2F0] shadow-soft overflow-hidden divide-y divide-[#EEF2F0]">
            {/* 1. Table & Floor Map */}
            <SettingRow
              icon={<LayoutGrid className="w-5 h-5" />}
              iconBgClass="bg-[#E8FAF0] text-[#009669]"
              title="Table & Floor Map"
              subtitle="Default layout & table assignment"
              onClick={() => setIsTableMapOpen(true)}
            />

            {/* 2. Help & Manager Desk */}
            <SettingRow
              icon={<HelpCircle className="w-5 h-5" />}
              iconBgClass="bg-[#EFF6FF] text-[#3B82F6]"
              title="Help & Manager Desk"
              subtitle="Emergency override & guides"
              onClick={() => setIsHelpOpen(true)}
            />
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-5">
          <button
            onClick={handleLogout}
            className="w-full bg-[#FFF5F5] hover:bg-[#FEE2E2] active:scale-[0.98] border border-[#FED7D7] transition-all text-[#E53E3E] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-[#E53E3E]" />
            <span>Log Out of Session</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-3 text-[11px] text-zinc-400 font-medium">
          Stitch POS v2.4.1 • Terminal #04 • Synced
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="w-full shrink-0">
        <HomeIndicator />
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
        onSave={updateProfile}
      />

      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      <TableMapModal
        isOpen={isTableMapOpen}
        onClose={() => setIsTableMapOpen(false)}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        hotline={user.emergencyHotline}
      />
    </div>
  );
};
