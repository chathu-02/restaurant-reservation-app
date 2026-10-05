import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../components/layout/StatusBar';
import { HomeIndicator } from '../components/layout/HomeIndicator';
import { StaffCard } from '../components/staff/StaffCard';
import { StaffFormModal } from '../components/staff/StaffFormModal';
import { DeleteStaffModal } from '../components/staff/DeleteStaffModal';
import { StaffEmptyState } from '../components/staff/StaffEmptyState';
import { useStaff } from '../context/StaffContext';
import { StaffFilterType, StaffMember } from '../types';
import { ChevronLeft, Plus, Search, Command } from 'lucide-react';

export const StaffAccountsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    filteredStaff,
    filter,
    searchQuery,
    totalCount,
    activeCount,
    managersCount,
    kitchenCount,
    setFilter,
    setSearchQuery,
    createStaff,
    updateStaff,
    toggleDuty,
    deleteStaff,
    resetToDefaults,
  } = useStaff();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<StaffMember | null>(null);

  const filterTabs: { id: StaffFilterType; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: totalCount },
    { id: 'ACTIVE', label: 'Active', count: activeCount },
    { id: 'MANAGERS', label: 'Managers', count: managersCount },
    { id: 'KITCHEN', label: 'Kitchen', count: kitchenCount },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#F6F9F8] min-h-full">
      {/* Top Main Section */}
      <div className="px-5 pt-1 pb-4 flex-1 overflow-y-auto no-scrollbar">
        {/* Status Bar with Headset icon */}
        <StatusBar time="9:41" showHeadset />

        {/* Header: Back button, Title + dynamic counts, Circular Plus button */}
        <div className="flex items-center justify-between mt-2 mb-4">
          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-white border border-[#EEF2F0] flex items-center justify-center text-zinc-600 hover:text-zinc-900 shadow-2xs active:scale-95 transition"
            title="Back to Dashboard"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5" />
          </button>

          {/* Centered Title & Status */}
          <div className="text-center">
            <h1 className="text-lg sm:text-xl font-extrabold text-zinc-900 tracking-tight">
              Staff accounts
            </h1>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#00B37E]" />
              <span>
                {totalCount} team members • {activeCount} active
              </span>
            </div>
          </div>

          {/* Add Staff Button (+) */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#181A1E] text-white flex items-center justify-center shadow-md hover:bg-zinc-800 active:scale-95 transition"
            title="Add New Staff Member"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar with Command Icon */}
        <div className="relative mb-3.5">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="w-full bg-[#EEF2F0]/60 border border-[#E5E7EB] rounded-2xl pl-10 pr-12 py-3 text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 bg-white/80 px-1.5 py-0.5 rounded-md border border-zinc-200 text-[10px] font-bold flex items-center gap-0.5">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>

        {/* Filter Chips / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mb-3.5">
          {filterTabs.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shrink-0 active:scale-95 ${
                  isSelected
                    ? 'bg-[#181A1E] text-white shadow-xs'
                    : 'bg-white border border-[#EEF2F0] text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Dinner Shift Roster Banner */}
        <div className="bg-[#E8FAF0] border border-emerald-200/50 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-[#009669] mb-3.5 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00B37E] animate-pulse" />
            <span>Dinner Shift Roster</span>
          </div>
          <span className="text-[11px] font-semibold text-[#00875A]">
            {activeCount} on clock • Handover 10 PM
          </span>
        </div>

        {/* Staff Members List */}
        <div className="space-y-3">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onToggleDuty={toggleDuty}
                onEdit={(m) => setEditingMember(m)}
                onDelete={(m) => setDeletingMember(m)}
              />
            ))
          ) : (
            <StaffEmptyState
              searchQuery={searchQuery}
              onReset={() => {
                setSearchQuery('');
                setFilter('ALL');
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Home Indicator */}
      <div className="w-full shrink-0">
        <HomeIndicator />
      </div>

      {/* Add Staff Modal (CREATE CRUD) */}
      <StaffFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={createStaff}
      />

      {/* Edit Staff Modal (UPDATE CRUD) */}
      <StaffFormModal
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        initialData={editingMember}
        onSubmit={(data) => {
          if (editingMember) {
            return updateStaff(editingMember.id, data);
          }
          return Promise.resolve();
        }}
      />

      {/* Delete Confirmation Modal (DELETE CRUD) */}
      <DeleteStaffModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        member={deletingMember}
        onConfirm={deleteStaff}
      />
    </div>
  );
};
