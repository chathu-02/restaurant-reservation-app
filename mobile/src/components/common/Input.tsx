import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightAction?: React.ReactNode;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightAction,
  isPassword = false,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold text-zinc-800">
            {label}
          </label>
          {rightAction}
        </div>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-zinc-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          type={resolvedType}
          className={`w-full bg-white border rounded-2xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 ${
            leftIcon ? 'pl-10' : ''
          } ${isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-[#E5E7EB] hover:border-zinc-300'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-zinc-400 hover:text-zinc-600 transition"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-zinc-400" />
            ) : (
              <Eye className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-rose-500 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-zinc-400">{helperText}</span>
      )}
    </div>
  );
};
