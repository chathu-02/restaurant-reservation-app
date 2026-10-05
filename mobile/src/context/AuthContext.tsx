import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrId: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleShift: () => Promise<void>;
  toggleAlertsSound: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => authService.getProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => authService.isAuthenticated());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Sync initial state
    setUser(authService.getProfile());
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const login = async (emailOrId: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login(emailOrId, pass);
      setUser(res.user);
      setIsAuthenticated(true);
      showToast(`Welcome back, ${res.user.name}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    showToast('Signed out of session', 'info');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await authService.updateProfile(updates);
      setUser(updated);
      showToast('Profile updated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
      throw err;
    }
  };

  const toggleShift = async () => {
    try {
      const updated = await authService.toggleShift();
      setUser(updated);
      showToast(
        updated.isOnShift ? 'Status changed to On Shift' : 'Status changed to Off Shift',
        'info'
      );
    } catch (err: any) {
      showToast('Failed to toggle shift', 'error');
    }
  };

  const toggleAlertsSound = async () => {
    try {
      const updated = await authService.toggleAlertsSound();
      setUser(updated);
      showToast(
        updated.alertsAndSound ? 'Shift alerts & sound enabled' : 'Shift alerts & sound muted',
        'info'
      );
    } catch (err: any) {
      showToast('Failed to toggle alerts', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateProfile,
        toggleShift,
        toggleAlertsSound,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
