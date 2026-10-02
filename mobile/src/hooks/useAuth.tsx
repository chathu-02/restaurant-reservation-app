import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  service: string;
  email: string;
  isOnDuty: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email?: string, name?: string) => void;
  logout: () => void;
  updateService: (service: string) => void;
  toggleDuty: () => void;
}

const DEFAULT_USER: User = {
  id: 'staff-lead-01',
  name: 'Sarah Mitchell',
  role: 'Shift Lead on Duty',
  service: 'DINNER SERVICE',
  email: 'sarah.mitchell@restaurant.com',
  isOnDuty: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);

  const login = (email: string = 'sarah.mitchell@restaurant.com', name: string = 'Sarah Mitchell') => {
    setUser({
      id: `staff-${Date.now()}`,
      name,
      role: 'Shift Lead on Duty',
      service: 'DINNER SERVICE',
      email,
      isOnDuty: true,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateService = (service: string) => {
    setUser((prev) => (prev ? { ...prev, service } : null));
  };

  const toggleDuty = () => {
    setUser((prev) => (prev ? { ...prev, isOnDuty: !prev.isOnDuty } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateService,
        toggleDuty,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
