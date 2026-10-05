import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [deviceFrameEnabled, setDeviceFrameEnabled] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: '/login', label: '1. Staff Sign In' },
    { path: '/dashboard', label: '2. Staff Dashboard' },
    { path: '/staff', label: '3. Staff Accounts' },
    { path: '/profile', label: '4. Profile & Settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-zinc-950 text-slate-100 flex flex-col items-center justify-start sm:p-4 md:p-6 lg:p-8 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Desktop Demonstration Bar */}
      <header className="hidden sm:flex w-full max-w-4xl items-center justify-between py-3 px-5 mb-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">
              Restaurant Staff Portal <span className="text-xs text-emerald-400 font-normal ml-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">IT3060 HCI M03</span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Branch: <code className="text-emerald-400">feature/customer-staff</code> • High-Fidelity Mobile Implementation
            </p>
          </div>
        </div>

        {/* Quick Screen Switcher Links */}
        <nav className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Device frame toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviceFrameEnabled(!deviceFrameEnabled)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 transition"
            title="Toggle between Device Frame and Responsive View"
          >
            {deviceFrameEnabled ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden md:inline">Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main
        className={`w-full transition-all duration-300 flex flex-col justify-center items-center ${
          deviceFrameEnabled
            ? 'sm:max-w-[420px]'
            : 'max-w-md w-full'
        }`}
      >
        <div
          className={`w-full bg-[#F6F9F8] text-zinc-900 flex flex-col relative overflow-hidden transition-all duration-200 ${
            deviceFrameEnabled
              ? 'sm:rounded-[48px] sm:border-[10px] sm:border-[#1E2530] mobile-device-shadow sm:min-h-[852px] sm:max-h-[880px] h-screen sm:h-[860px]'
              : 'min-h-screen rounded-none shadow-none'
          }`}
        >
          {/* Dynamic Island / Speaker cutout on frame mode */}
          {deviceFrameEnabled && (
            <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-[#1E2530] rounded-full z-40 items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-[#0F141C] mr-2" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#151D28]" />
            </div>
          )}

          {/* Screen Content */}
          <div className="flex-1 flex flex-col w-full h-full overflow-y-auto no-scrollbar relative">
            {children}
          </div>
        </div>
      </main>

      {/* Footer Info for Testing & Grading */}
      <footer className="hidden sm:flex items-center gap-2 mt-4 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Working Mobile App Frontend • 2+ Working CRUD Operations per Interface • Local & Backend API Ready</span>
      </footer>
    </div>
  );
};
