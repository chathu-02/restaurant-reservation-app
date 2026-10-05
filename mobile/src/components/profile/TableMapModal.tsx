import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface TableMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableMapModal: React.FC<TableMapModalProps> = ({ isOpen, onClose }) => {
  const tables = [
    { num: 1, seats: 2, status: 'OCCUPIED' },
    { num: 2, seats: 2, status: 'OCCUPIED' },
    { num: 3, seats: 4, status: 'FREE' },
    { num: 4, seats: 4, status: 'RESERVED' },
    { num: 5, seats: 6, status: 'OCCUPIED' },
    { num: 6, seats: 2, status: 'FREE' },
    { num: 7, seats: 4, status: 'OCCUPIED' },
    { num: 8, seats: 4, status: 'OCCUPIED' },
    { num: 9, seats: 2, status: 'RESERVED' },
    { num: 10, seats: 6, status: 'OCCUPIED' },
    { num: 11, seats: 4, status: 'FREE' },
    { num: 12, seats: 4, status: 'OCCUPIED' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Table & Floor Map"
      subtitle="Zone A Floor Layout (12/20 Occupied)"
      maxWidth="md"
    >
      <div className="flex flex-col gap-4">
        {/* Status Legend */}
        <div className="flex items-center justify-around bg-zinc-50 border border-zinc-200/80 rounded-2xl p-2.5 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-600">Free (8)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-zinc-600">Occupied (12)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-zinc-600">Reserved</span>
          </div>
        </div>

        {/* Floor Map Grid */}
        <div className="grid grid-cols-3 gap-2.5 bg-zinc-100/70 p-3 rounded-2xl border border-zinc-200/60">
          {tables.map((t) => (
            <div
              key={t.num}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition ${
                t.status === 'OCCUPIED'
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : t.status === 'RESERVED'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <span className="text-xs font-extrabold">Table {t.num}</span>
              <span className="text-[10px] font-medium opacity-80 mt-0.5">
                {t.seats} seats • {t.status}
              </span>
            </div>
          ))}
        </div>

        <Button variant="primary" onClick={onClose} fullWidth className="bg-[#181A1E]">
          Close Floor Plan
        </Button>
      </div>
    </Modal>
  );
};
