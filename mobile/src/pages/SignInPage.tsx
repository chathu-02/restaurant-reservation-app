import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/layout/StatusBar';
import { HomeIndicator } from '../components/layout/HomeIndicator';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Utensils, ArrowRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrId?: string; password?: string }>({});
  const [showTroubleModal, setShowTroubleModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const validate = () => {
    const errs: { emailOrId?: string; password?: string } = {};
    if (!emailOrId.trim()) {
      errs.emailOrId = 'Please enter your staff email or ID';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 4) {
      errs.password = 'Password must be at least 4 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(emailOrId.trim(), password);
      navigate('/dashboard');
    } catch {
      // Error handled by AuthContext toast
    }
  };

  const handleQuickFill = (role: 'manager' | 'staff') => {
    if (role === 'manager') {
      setEmailOrId('kaweerna.sneha@email.com');
      setPassword('manager123');
    } else {
      setEmailOrId('jane.doe@restaurant.com');
      setPassword('staff123');
    }
    setErrors({});
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-gradient-to-b from-white via-[#F6F9F8] to-[#F6F9F8] px-6 pb-2 min-h-full">
      {/* Top Header & Status */}
      <div>
        <StatusBar time="9:41" />

        {/* Back navigation */}
        <div className="pt-2 pb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-9 h-9 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center text-zinc-600 hover:text-zinc-900 transition shadow-2xs active:scale-95"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>
        </div>

        {/* Centered Fork & Knife Icon + STAFF ACCESS Badge */}
        <div className="flex flex-col items-center justify-center pt-2 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#181A1E] shadow-lg flex items-center justify-center mb-3.5 border border-zinc-800">
            <Utensils className="w-8 h-8 text-[#00E599]" strokeWidth={2.2} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FAF0] border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-[#00B37E]" />
            <span className="text-[11px] font-extrabold tracking-wider text-[#00875A] uppercase">
              STAFF ACCESS
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-left mb-6">
          <h1 className="text-3xl font-extrabold text-zinc-900 tracking-tight">
            Staff sign in
          </h1>
          <p className="text-sm text-zinc-400 font-medium mt-1">
            For restaurant team members & managers
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <Input
            label="Staff email or ID"
            placeholder="e.g. staff@restaurant.com or ID"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            error={errors.emailOrId}
          />

          <Input
            label="Password"
            type="password"
            isPassword
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            rightAction={
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-[#009669] hover:text-emerald-700 transition"
              >
                Forgot password?
              </button>
            }
          />

          {/* Sign In Button with Green Arrow */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#181A1E] hover:bg-zinc-800 active:scale-[0.98] transition-all text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4 text-[#00E599]" />}
          </button>
        </form>

        {/* Quick Demo Test Buttons */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <span className="text-[11px] text-zinc-400 font-medium">Quick Fill:</span>
          <button
            type="button"
            onClick={() => handleQuickFill('manager')}
            className="text-[11px] font-semibold text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60"
          >
            Manager (Kaweerna)
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('staff')}
            className="text-[11px] font-semibold text-zinc-600 hover:underline bg-zinc-100 px-2 py-0.5 rounded-lg border border-zinc-200"
          >
            Staff (Jane)
          </button>
        </div>
      </div>

      {/* Bottom Trouble Signing In Card & Home Indicator */}
      <div className="pt-8">
        <div
          onClick={() => setShowTroubleModal(true)}
          className="bg-white rounded-2xl p-4 border border-[#EEF2F0] shadow-soft flex items-center gap-3 cursor-pointer hover:border-zinc-300 transition"
        >
          <div className="w-8 h-8 rounded-xl bg-[#E8FAF0] text-[#009669] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">Trouble signing in?</div>
            <div className="text-xs font-bold text-zinc-900">
              Contact restaurant manager
            </div>
          </div>
        </div>

        <HomeIndicator />
      </div>

      {/* Trouble Signing In Modal */}
      <Modal
        isOpen={showTroubleModal}
        onClose={() => setShowTroubleModal(false)}
        title="Staff Access Assistance"
        subtitle="Terminal login & credential recovery"
      >
        <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
          <p>
            Staff credentials are automatically provisioned by your general operations manager during onboarding.
          </p>
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-emerald-900">
            <strong>Floor Manager Hotline:</strong> +1 (800) 555-STITCH (Ext 401)<br />
            <strong>Station Shift:</strong> Duty Supervisor Zone A
          </div>
          <Button variant="primary" onClick={() => setShowTroubleModal(false)} fullWidth className="bg-[#181A1E] mt-2">
            Got it
          </Button>
        </div>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password / PIN"
        subtitle="Request temporary passcode from manager"
      >
        <div className="space-y-3 text-xs text-zinc-600 leading-relaxed">
          <p>
            Please request a temporary 6-digit one-time passcode from the on-duty manager (Kaweerna Sneha) at the host terminal.
          </p>
          <Button variant="primary" onClick={() => setShowForgotModal(false)} fullWidth className="bg-[#181A1E] mt-2">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};
