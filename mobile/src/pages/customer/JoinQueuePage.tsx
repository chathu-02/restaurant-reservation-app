import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/layout/StatusBar';
import { HomeIndicator } from '../../components/layout/HomeIndicator';
import { useCustomer } from '../../context/CustomerContext';
import { SeatingPreferenceType } from '../../types';
import {
  ChevronLeft,
  Users,
  User,
  Minus,
  Plus,
  Armchair,
  Leaf,
  Sparkles,
  Bell,
  ArrowRight,
} from 'lucide-react';

export const JoinQueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { joinQueue } = useCustomer();

  const [fullName, setFullName] = useState('Alex Johnson');
  const [phoneNumber, setPhoneNumber] = useState('(555) 439-9201');
  const [partySize, setPartySize] = useState(2);
  const [seatingPreference, setSeatingPreference] = useState<SeatingPreferenceType>('Indoor');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; phoneNumber?: string }>({});

  const partySizePills = [2, 4, 6, 8];

  const validate = () => {
    const errs: { fullName?: string; phoneNumber?: string } = {};
    if (!fullName.trim()) errs.fullName = 'Full name is required';
    if (!phoneNumber.trim()) errs.phoneNumber = 'Phone number is required for SMS table call';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleJoinQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await joinQueue({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        partySize,
        seatingPreference,
        specialRequests: specialRequests.trim() || undefined,
      });
      // Navigate to Live Queue Tracking (Screenshot 2)
      navigate('/queue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#F2FBF7] via-[#F6F9F8] to-[#F6F9F8] min-h-full">
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status bar */}
        <StatusBar time="9:41" />

        {/* Top Header */}
        <div className="flex items-center justify-between mt-2 mb-3.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          <div className="text-center">
            <h1 className="text-lg font-extrabold text-zinc-900 tracking-tight">
              Join the queue
            </h1>
            <p className="text-xs font-semibold text-[#009669]">
              The Green Terrace <span className="text-zinc-400 font-normal">• Riverside Ave</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FAF0] border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-[#00B37E] animate-pulse" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#00875A] uppercase">
              LIVE
            </span>
          </div>
        </div>

        {/* Current Wait Time Banner Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#EEF2F0] shadow-soft flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#00B37E] flex items-center justify-center text-white shrink-0 shadow-sm">
              <span className="w-4 h-4 rounded-full border-3 border-white inline-block" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-zinc-900 leading-tight">
                Current wait ~20 min
              </div>
              <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-[#009669]" />
                <span><strong>6 groups</strong> ahead of you</span>
              </div>
            </div>
          </div>
          <span className="bg-[#E8FAF0] text-[#00875A] text-[10px] font-extrabold tracking-wider px-2.5 py-1 rounded-md uppercase">
            FAST TURN
          </span>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleJoinQueue} className="space-y-4">
          {/* 1. Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-zinc-700 mb-1.5 px-1">
              FULL NAME
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full bg-white border border-[#E5E7EB] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-zinc-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
            </div>
            {errors.fullName && (
              <span className="text-xs text-rose-500 font-medium mt-1 block px-1">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* 2. Phone Number */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-[11px] font-extrabold tracking-wider uppercase text-zinc-700">
                PHONE NUMBER
              </label>
              <span className="text-[11px] text-zinc-400 font-medium">For SMS updates</span>
            </div>
            <div className="flex items-center bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3.5 shadow-2xs focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-600 transition">
              <span className="text-xs font-bold text-zinc-600 pr-3 border-r border-zinc-200 shrink-0">
                us +1
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full pl-3 text-sm text-zinc-900 font-semibold focus:outline-none bg-transparent"
              />
            </div>
            {errors.phoneNumber && (
              <span className="text-xs text-rose-500 font-medium mt-1 block px-1">
                {errors.phoneNumber}
              </span>
            )}
          </div>

          {/* 3. Party Size */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-zinc-700 mb-1.5 px-1">
              PARTY SIZE
            </label>
            {/* Counter box */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xs mb-2">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-zinc-400" />
                <span className="text-sm font-bold text-zinc-900">{partySize} Guests</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 active:scale-90 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-extrabold text-zinc-900 w-4 text-center">
                  {partySize}
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize(partySize + 1)}
                  className="w-8 h-8 rounded-full bg-[#181A1E] text-white flex items-center justify-center active:scale-90 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Pills */}
            <div className="grid grid-cols-4 gap-2">
              {partySizePills.map((count) => {
                const label = count === 8 ? '8+ ppl' : `${count} ppl`;
                const isSelected = partySize === count;
                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setPartySize(count)}
                    className={`py-2 px-1 text-xs font-bold rounded-2xl text-center transition-all ${
                      isSelected
                        ? 'bg-[#181A1E] text-white shadow-xs'
                        : 'bg-white border border-[#E5E7EB] text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Seating Preference */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <label className="text-[11px] font-extrabold tracking-wider uppercase text-zinc-700">
                SEATING PREFERENCE
              </label>
              <span className="text-[11px] text-zinc-400 font-medium">Optional</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Indoor */}
              <button
                type="button"
                onClick={() => setSeatingPreference('Indoor')}
                className={`p-3.5 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-150 ${
                  seatingPreference === 'Indoor'
                    ? 'bg-[#181A1E] border-[#181A1E] text-white shadow-sm'
                    : 'bg-white border-[#E5E7EB] text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Armchair
                  className={`w-5 h-5 mb-1.5 ${
                    seatingPreference === 'Indoor' ? 'text-sky-400' : 'text-zinc-500'
                  }`}
                />
                <span className="text-xs font-extrabold">Indoor</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    seatingPreference === 'Indoor' ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  Dining hall
                </span>
              </button>

              {/* Outdoor */}
              <button
                type="button"
                onClick={() => setSeatingPreference('Outdoor')}
                className={`p-3.5 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-150 ${
                  seatingPreference === 'Outdoor'
                    ? 'bg-[#181A1E] border-[#181A1E] text-white shadow-sm'
                    : 'bg-white border-[#E5E7EB] text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Leaf
                  className={`w-5 h-5 mb-1.5 ${
                    seatingPreference === 'Outdoor' ? 'text-emerald-400' : 'text-emerald-600'
                  }`}
                />
                <span className="text-xs font-extrabold">Outdoor</span>
                <span
                  className={`text-[10px] mt-0.5 ${
                    seatingPreference === 'Outdoor' ? 'text-zinc-400' : 'text-zinc-400'
                  }`}
                >
                  Garden patio
                </span>
              </button>

              {/* Any table */}
              <button
                type="button"
                onClick={() => setSeatingPreference('Any table')}
                className={`p-3.5 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-150 ${
                  seatingPreference === 'Any table'
                    ? 'bg-[#181A1E] border-[#181A1E] text-white shadow-sm'
                    : 'bg-white border-[#E5E7EB] text-zinc-900 hover:border-zinc-300'
                }`}
              >
                <Sparkles
                  className={`w-5 h-5 mb-1.5 ${
                    seatingPreference === 'Any table' ? 'text-amber-400' : 'text-amber-500'
                  }`}
                />
                <span className="text-xs font-extrabold">Any table</span>
                <span
                  className={`text-[10px] font-bold mt-0.5 ${
                    seatingPreference === 'Any table' ? 'text-emerald-400' : 'text-[#009669]'
                  }`}
                >
                  Fastest
                </span>
              </button>
            </div>
          </div>

          {/* 5. Special Requests */}
          <div>
            <label className="block text-[11px] font-extrabold tracking-wider uppercase text-zinc-700 mb-1.5 px-1">
              SPECIAL REQUESTS
            </label>
            <input
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="e.g. High chair needed, booth if possible"
              className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* 6. SMS Notice Banner */}
          <div className="bg-[#E8FAF0] border border-emerald-200/60 rounded-3xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
            <Bell className="w-4 h-4 text-[#009669] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              We'll send an SMS when your table is <strong>5 minutes away</strong>. You won't lose your spot in line.
            </p>
          </div>

          {/* 7. Estimated Seating & Action */}
          <div className="pt-1">
            <div className="flex items-center justify-between text-xs font-semibold px-1 mb-2">
              <div className="flex items-center gap-1.5 text-zinc-500">
                <span className="w-2 h-2 rounded-full bg-[#00B37E]" />
                <span>Estimated seating time</span>
              </div>
              <span className="font-extrabold text-zinc-900 text-sm">~10:05 PM</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#181A1E] hover:bg-zinc-800 active:scale-[0.98] transition-all text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Joining...' : 'Join Queue'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-[#00E599]" />}
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Home Indicator */}
      <div className="w-full shrink-0">
        <HomeIndicator />
      </div>
    </div>
  );
};
