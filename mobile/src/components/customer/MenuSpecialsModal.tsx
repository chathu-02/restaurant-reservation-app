import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Sparkles, Utensils, Star } from 'lucide-react';

interface MenuSpecialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MenuSpecialsModal: React.FC<MenuSpecialsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const specials = [
    {
      name: 'Pan-Seared Sea Bass',
      description: 'Saffron emulsion, asparagus spears, crushed new potatoes',
      price: '$34.00',
      tag: "Chef's Special",
    },
    {
      name: 'Truffle & Wild Mushroom Tagliatelle',
      description: 'Handmade pasta, shaved black truffle, aged parmesan crisp',
      price: '$28.50',
      tag: 'Popular',
    },
    {
      name: 'Smoked Duck Breast & Cherry Reduction',
      description: 'Parsnip purée, roasted baby beets, micro herbs',
      price: '$36.00',
      tag: 'New',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Specials & Menu"
      subtitle="Today's signature dishes while you wait"
    >
      <div className="flex flex-col gap-3">
        <div className="bg-[#E8FAF0] border border-emerald-200/60 rounded-2xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-900">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Complimentary amuse-bouche served upon seating for waiting guests!</span>
        </div>

        <div className="space-y-3 mt-1">
          {specials.map((item) => (
            <div
              key={item.name}
              className="bg-white border border-[#EEF2F0] rounded-2xl p-3.5 shadow-2xs hover:border-zinc-300 transition"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                  <span>{item.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {item.tag}
                  </span>
                </h4>
                <span className="text-xs sm:text-sm font-extrabold text-zinc-900">{item.price}</span>
              </div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <Button variant="primary" onClick={onClose} fullWidth className="bg-[#181A1E] mt-2">
          Back to Queue
        </Button>
      </div>
    </Modal>
  );
};
