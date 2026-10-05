import { StaffMember, StaffRole } from '../types';
import { api } from './api';

const STORAGE_KEY = 'stitch_staff_members_v1';

// Initial seed data exactly matching Screenshot 3
const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    staffCode: '#ST-101',
    name: 'Jane Doe',
    role: 'MANAGER',
    department: 'General Operations',
    isOnDuty: true,
    avatarColor: 'purple',
    initials: 'JD',
    email: 'jane.doe@restaurant.com',
    phone: '+1 (555) 234-5678',
    shift: 'Dinner Shift A',
  },
  {
    id: 'staff-2',
    staffCode: '#ST-108',
    name: 'Mark Smith',
    role: 'KITCHEN',
    department: 'Head Line Chef',
    isOnDuty: true,
    avatarColor: 'orange',
    initials: 'MS',
    email: 'mark.smith@restaurant.com',
    phone: '+1 (555) 345-6789',
    shift: 'Dinner Shift A',
  },
  {
    id: 'staff-3',
    staffCode: '#ST-114',
    name: 'Alex Lee',
    role: 'STAFF',
    department: 'Server & Host',
    isOnDuty: false,
    avatarColor: 'gray',
    initials: 'AL',
    email: 'alex.lee@restaurant.com',
    phone: '+1 (555) 456-7890',
    shift: 'Closing Shift B',
  },
  {
    id: 'staff-4',
    staffCode: '#ST-122',
    name: 'Rachel Wong',
    role: 'STAFF',
    department: 'Floor Lead',
    isOnDuty: true,
    avatarColor: 'emerald',
    initials: 'RW',
    email: 'rachel.wong@restaurant.com',
    phone: '+1 (555) 567-8901',
    shift: 'Dinner Shift A',
  },
];

class StaffService {
  private getLocalStaff(): StaffMember[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      this.saveLocalStaff(INITIAL_STAFF);
      return INITIAL_STAFF;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STAFF;
    }
  }

  private saveLocalStaff(staff: StaffMember[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(staff));
  }

  async getAll(): Promise<StaffMember[]> {
    try {
      // Attempt backend API call
      const data = await api.get<{ data: StaffMember[] }>('/staff');
      if (data && Array.isArray(data.data)) {
        this.saveLocalStaff(data.data);
        return data.data;
      }
    } catch {
      // Backend not running; seamless fallback to stored local state
    }
    return this.getLocalStaff();
  }

  async getById(id: string): Promise<StaffMember | null> {
    const list = this.getLocalStaff();
    return list.find((s) => s.id === id) || null;
  }

  async create(data: {
    name: string;
    role: StaffRole;
    department: string;
    isOnDuty?: boolean;
    email?: string;
    phone?: string;
    staffCode?: string;
  }): Promise<StaffMember> {
    const list = this.getLocalStaff();

    // Determine initials
    const parts = data.name.trim().split(/\s+/);
    const initials = parts.length > 1
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : data.name.slice(0, 2).toUpperCase();

    // Determine color based on role
    const avatarColor =
      data.role === 'MANAGER'
        ? 'purple'
        : data.role === 'KITCHEN'
        ? 'orange'
        : 'emerald';

    const nextNum = 123 + list.length;
    const staffCode = data.staffCode || `#ST-${nextNum}`;

    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      staffCode,
      name: data.name.trim(),
      role: data.role,
      department: data.department.trim(),
      isOnDuty: data.isOnDuty ?? true,
      avatarColor,
      initials,
      email: data.email || `${data.name.toLowerCase().replace(/\s+/g, '.')}@restaurant.com`,
      phone: data.phone || '+1 (555) 000-0000',
      shift: 'Dinner Shift A',
    };

    const updated = [...list, newMember];
    this.saveLocalStaff(updated);

    try {
      await api.post('/staff', newMember);
    } catch {
      // Local fallback saved
    }

    return newMember;
  }

  async update(id: string, updates: Partial<StaffMember>): Promise<StaffMember> {
    const list = this.getLocalStaff();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Staff member with ID ${id} not found.`);
    }

    const current = list[index];
    let initials = current.initials;
    if (updates.name && updates.name !== current.name) {
      const parts = updates.name.trim().split(/\s+/);
      initials = parts.length > 1
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : updates.name.slice(0, 2).toUpperCase();
    }

    const updatedMember: StaffMember = {
      ...current,
      ...updates,
      initials,
    };

    list[index] = updatedMember;
    this.saveLocalStaff(list);

    try {
      await api.put(`/staff/${id}`, updatedMember);
    } catch {
      // Local fallback saved
    }

    return updatedMember;
  }

  async toggleDuty(id: string): Promise<StaffMember> {
    const member = await this.getById(id);
    if (!member) throw new Error('Member not found');
    return this.update(id, { isOnDuty: !member.isOnDuty });
  }

  async delete(id: string): Promise<void> {
    const list = this.getLocalStaff();
    const filtered = list.filter((s) => s.id !== id);
    this.saveLocalStaff(filtered);

    try {
      await api.delete(`/staff/${id}`);
    } catch {
      // Local fallback saved
    }
  }

  resetToDefault(): StaffMember[] {
    this.saveLocalStaff(INITIAL_STAFF);
    return INITIAL_STAFF;
  }
}

export const staffService = new StaffService();
