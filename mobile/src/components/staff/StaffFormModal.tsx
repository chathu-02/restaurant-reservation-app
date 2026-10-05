import React, { useState, useEffect } from 'react';
import { StaffMember, StaffRole } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { User, Briefcase, Mail, Phone, Hash } from 'lucide-react';

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    role: StaffRole;
    department: string;
    isOnDuty?: boolean;
    email?: string;
    phone?: string;
    staffCode?: string;
  }) => Promise<any>;
  initialData?: StaffMember | null;
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('STAFF');
  const [department, setDepartment] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isOnDuty, setIsOnDuty] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; department?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRole(initialData.role);
      setDepartment(initialData.department);
      setStaffCode(initialData.staffCode);
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setIsOnDuty(initialData.isOnDuty);
    } else {
      setName('');
      setRole('STAFF');
      setDepartment('');
      setStaffCode('');
      setEmail('');
      setPhone('');
      setIsOnDuty(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs: { name?: string; department?: string } = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!department.trim()) errs.department = 'Role department / station is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        role,
        department: department.trim(),
        isOnDuty,
        email: email.trim(),
        phone: phone.trim(),
        staffCode: staffCode.trim() || undefined,
      });
      onClose();
    } catch {
      // Error handled by parent context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
      subtitle={
        isEditing
          ? `Update details for ${initialData?.name}`
          : 'Provision new credentials and assign station'
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Liam Anderson"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          leftIcon={<User className="w-4 h-4" />}
        />

        {/* Role Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs sm:text-sm font-semibold text-zinc-800">
            Access Role *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['STAFF', 'KITCHEN', 'MANAGER'] as StaffRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 px-2 text-xs font-bold rounded-xl border text-center transition ${
                  role === r
                    ? r === 'MANAGER'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : r === 'KITCHEN'
                      ? 'border-amber-600 bg-amber-50 text-amber-700'
                      : 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Department / Title *"
            placeholder="e.g. Floor Lead"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            error={errors.department}
            leftIcon={<Briefcase className="w-4 h-4" />}
          />
          <Input
            label="Staff Code"
            placeholder="e.g. #ST-125"
            value={staffCode}
            onChange={(e) => setStaffCode(e.target.value)}
            leftIcon={<Hash className="w-4 h-4" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@restaurant.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            label="Phone Number"
            placeholder="+1 555 0192"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
          />
        </div>

        {/* On Duty Checkbox */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <div>
            <div className="text-xs font-bold text-zinc-900">Current Shift Status</div>
            <div className="text-[11px] text-zinc-400">Mark staff as active on clock</div>
          </div>
          <button
            type="button"
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors ${
              isOnDuty ? 'bg-[#009669]' : 'bg-[#D1D5DB]'
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                isOnDuty ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex gap-2.5 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 bg-[#181A1E]"
          >
            {isEditing ? 'Save Changes' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
