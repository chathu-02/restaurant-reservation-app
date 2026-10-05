import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelOn?: string;
  labelOff?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  labelOn = 'On duty',
  labelOff = 'Off duty',
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`inline-flex items-center gap-2 select-none cursor-pointer ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      <div
        className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
          checked ? 'bg-[#009669]' : 'bg-[#D1D5DB]'
        }`}
      >
        <div
          className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
      <span
        className={`text-xs font-semibold ${
          checked ? 'text-[#009669]' : 'text-[#6B7280]'
        }`}
      >
        {checked ? labelOn : labelOff}
      </span>
    </div>
  );
};
