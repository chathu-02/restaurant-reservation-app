import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  CustomerNotificationItem,
  CustomerProfile,
  CustomerQueueStatus,
  JoinQueueFormPayload,
} from '../types';
import { customerService } from '../services/customerService';
import { useToast } from './ToastContext';

interface CustomerContextType {
  profile: CustomerProfile;
  queueStatus: CustomerQueueStatus | null;
  notifications: CustomerNotificationItem[];
  unreadCount: number;
  joinQueue: (payload: JoinQueueFormPayload) => Promise<CustomerQueueStatus>;
  leaveQueue: () => Promise<void>;
  updateProfile: (updates: Partial<CustomerProfile>) => Promise<void>;
  toggleReminders: () => Promise<void>;
  toggleQueueAlerts: () => Promise<void>;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  logoutCustomer: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<CustomerProfile>(() => customerService.getProfile());
  const [queueStatus, setQueueStatus] = useState<CustomerQueueStatus | null>(() =>
    customerService.getQueueStatus()
  );
  const [notifications, setNotifications] = useState<CustomerNotificationItem[]>(() =>
    customerService.getNotifications()
  );
  const { showToast } = useToast();

  useEffect(() => {
    setProfile(customerService.getProfile());
    setQueueStatus(customerService.getQueueStatus());
    setNotifications(customerService.getNotifications());
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications]
  );

  const joinQueue = async (payload: JoinQueueFormPayload) => {
    try {
      const entry = await customerService.joinQueue(payload);
      setQueueStatus(entry);
      showToast(`Joined queue at ${entry.restaurantName}! You are #${entry.position} in line.`, 'success');
      return entry;
    } catch (err: any) {
      showToast(err.message || 'Failed to join queue', 'error');
      throw err;
    }
  };

  const leaveQueue = async () => {
    try {
      await customerService.leaveQueue();
      setQueueStatus(null);
      showToast('You have left the queue.', 'info');
    } catch {
      showToast('Error leaving queue', 'error');
    }
  };

  const updateProfile = async (updates: Partial<CustomerProfile>) => {
    try {
      const updated = await customerService.updateProfile(updates);
      setProfile(updated);
      showToast('Customer profile updated', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  const toggleReminders = async () => {
    try {
      const updated = await customerService.updateProfile({
        remindersEnabled: !profile.remindersEnabled,
      });
      setProfile(updated);
      showToast(
        updated.remindersEnabled ? 'Booking reminders enabled' : 'Booking reminders disabled',
        'info'
      );
    } catch {
      showToast('Failed to update reminder settings', 'error');
    }
  };

  const toggleQueueAlerts = async () => {
    try {
      const updated = await customerService.updateProfile({
        queueAlertsEnabled: !profile.queueAlertsEnabled,
      });
      setProfile(updated);
      showToast(
        updated.queueAlertsEnabled ? 'Queue alerts enabled' : 'Queue alerts muted',
        'info'
      );
    } catch {
      showToast('Failed to update alert settings', 'error');
    }
  };

  const markAllNotificationsRead = () => {
    const updated = customerService.markAllAsRead();
    setNotifications(updated);
    showToast('All notifications marked as read', 'success');
  };

  const markNotificationRead = (id: string) => {
    const updated = customerService.markAsRead(id);
    setNotifications(updated);
  };

  const logoutCustomer = () => {
    showToast('Logged out of customer session', 'info');
  };

  return (
    <CustomerContext.Provider
      value={{
        profile,
        queueStatus,
        notifications,
        unreadCount,
        joinQueue,
        leaveQueue,
        updateProfile,
        toggleReminders,
        toggleQueueAlerts,
        markAllNotificationsRead,
        markNotificationRead,
        logoutCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
