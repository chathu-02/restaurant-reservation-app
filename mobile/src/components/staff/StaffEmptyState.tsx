import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface StaffEmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export const StaffEmptyState: React.FC<StaffEmptyStateProps> = ({
  searchQuery,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-[#EEF2F0] shadow-soft text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="text-sm font-bold text-zinc-800">No staff members found</h3>
      <p className="text-xs text-zinc-400 mt-1 max-w-xs">
        {searchQuery
          ? `No team members matched "${searchQuery}". Try searching by another name or role.`
          : 'No members in this category currently.'}
      </p>
      <Button
        variant="secondary"
        size="sm"
        onClick={onReset}
        leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        className="mt-4"
      >
        Reset Filters
      </Button>
    </div>
  );
};
