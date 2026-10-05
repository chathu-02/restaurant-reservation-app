import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { StaffFilterType, StaffMember, StaffRole } from '../types';
import { staffService } from '../services/staffService';
import { useToast } from './ToastContext';

interface StaffContextType {
  staffList: StaffMember[];
  filteredStaff: StaffMember[];
  filter: StaffFilterType;
  searchQuery: string;
  isLoading: boolean;
  totalCount: number;
  activeCount: number;
  managersCount: number;
  kitchenCount: number;
  setFilter: (f: StaffFilterType) => void;
  setSearchQuery: (q: string) => void;
  createStaff: (data: {
    name: string;
    role: StaffRole;
    department: string;
    isOnDuty?: boolean;
    email?: string;
    phone?: string;
    staffCode?: string;
  }) => Promise<StaffMember>;
  updateStaff: (id: string, updates: Partial<StaffMember>) => Promise<StaffMember>;
  toggleDuty: (id: string) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  resetToDefaults: () => void;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [filter, setFilter] = useState<StaffFilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setIsLoading(true);
    try {
      const data = await staffService.getAll();
      setStaffList(data);
    } catch {
      showToast('Error loading staff roster', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const totalCount = staffList.length;
  const activeCount = useMemo(() => staffList.filter((s) => s.isOnDuty).length, [staffList]);
  const managersCount = useMemo(() => staffList.filter((s) => s.role === 'MANAGER').length, [staffList]);
  const kitchenCount = useMemo(() => staffList.filter((s) => s.role === 'KITCHEN').length, [staffList]);

  const filteredStaff = useMemo(() => {
    return staffList.filter((member) => {
      // Role & status filter
      if (filter === 'ACTIVE' && !member.isOnDuty) return false;
      if (filter === 'MANAGERS' && member.role !== 'MANAGER') return false;
      if (filter === 'KITCHEN' && member.role !== 'KITCHEN') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = member.name.toLowerCase().includes(q);
        const matchesRole = member.role.toLowerCase().includes(q);
        const matchesDept = member.department.toLowerCase().includes(q);
        const matchesCode = member.staffCode.toLowerCase().includes(q);
        return matchesName || matchesRole || matchesDept || matchesCode;
      }

      return true;
    });
  }, [staffList, filter, searchQuery]);

  const createStaff = async (data: {
    name: string;
    role: StaffRole;
    department: string;
    isOnDuty?: boolean;
    email?: string;
    phone?: string;
    staffCode?: string;
  }) => {
    try {
      const newMember = await staffService.create(data);
      setStaffList((prev) => [...prev, newMember]);
      showToast(`Added ${newMember.name} to staff roster`, 'success');
      return newMember;
    } catch (err: any) {
      showToast(err.message || 'Failed to add staff member', 'error');
      throw err;
    }
  };

  const updateStaff = async (id: string, updates: Partial<StaffMember>) => {
    try {
      const updated = await staffService.update(id, updates);
      setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(`Updated details for ${updated.name}`, 'success');
      return updated;
    } catch (err: any) {
      showToast(err.message || 'Failed to update staff member', 'error');
      throw err;
    }
  };

  const toggleDuty = async (id: string) => {
    try {
      const updated = await staffService.toggleDuty(id);
      setStaffList((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(
        `${updated.name} is now ${updated.isOnDuty ? 'On duty' : 'Off duty'}`,
        updated.isOnDuty ? 'success' : 'info'
      );
    } catch (err: any) {
      showToast('Failed to change duty status', 'error');
    }
  };

  const deleteStaff = async (id: string) => {
    try {
      const target = staffList.find((s) => s.id === id);
      await staffService.delete(id);
      setStaffList((prev) => prev.filter((s) => s.id !== id));
      showToast(`Removed ${target?.name || 'staff member'} from roster`, 'info');
    } catch (err: any) {
      showToast('Failed to delete staff member', 'error');
    }
  };

  const resetToDefaults = () => {
    const list = staffService.resetToDefault();
    setStaffList(list);
    showToast('Reset staff roster to original defaults', 'info');
  };

  return (
    <StaffContext.Provider
      value={{
        staffList,
        filteredStaff,
        filter,
        searchQuery,
        isLoading,
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
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};
