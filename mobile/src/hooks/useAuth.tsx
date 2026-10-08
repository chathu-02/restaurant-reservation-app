import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { login as authLogin, logout as authLogout } from '@/lib/auth';

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
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateService: (service: string) => Promise<void>;
  toggleDuty: () => Promise<void>;
}

const DEFAULT_STAFF: User = {
  id: 'staff-lead-01',
  name: 'Sarah Mitchell',
  role: 'manager',
  service: 'DINNER SERVICE',
  email: 'sarah.mitchell@restaurant.com',
  isOnDuty: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(DEFAULT_STAFF);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // Fallback to default staff for active dev/preview if no auth session
        setUser(DEFAULT_STAFF);
        return;
      }

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const unsubDoc = onSnapshot(
        userDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setUser({
              id: firebaseUser.uid,
              name: data.name || firebaseUser.displayName || 'Staff Member',
              role: data.role || 'manager',
              service: data.service || 'DINNER SERVICE',
              email: data.email || firebaseUser.email || '',
              isOnDuty: data.isOnDuty !== undefined ? data.isOnDuty : true,
              avatarUrl: data.avatarUrl,
            });
          } else {
            setUser({
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Staff Member',
              role: 'manager',
              service: 'DINNER SERVICE',
              email: firebaseUser.email || '',
              isOnDuty: true,
            });
          }
        },
        (err) => {
          console.warn('Firestore user doc snapshot error, using auth fallback:', err);
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Staff Member',
            role: 'manager',
            service: 'DINNER SERVICE',
            email: firebaseUser.email || '',
            isOnDuty: true,
          });
        }
      );

      return () => unsubDoc();
    });

    return () => unsubAuth();
  }, []);

  const login = async (email: string = 'sarah.mitchell@restaurant.com', password?: string) => {
    if (password) {
      await authLogin(email, password);
    } else {
      setUser({
        id: `staff-${Date.now()}`,
        name: email.split('@')[0] || 'Staff User',
        role: 'manager',
        service: 'DINNER SERVICE',
        email,
        isOnDuty: true,
      });
    }
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch {
      await signOut(auth);
    }
    setUser(null);
  };

  const updateService = async (service: string) => {
    setUser((prev) => (prev ? { ...prev, service } : null));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { service });
      } catch (err) {
        console.warn('Failed to update service in Firestore:', err);
      }
    }
  };

  const toggleDuty = async () => {
    const newDuty = user ? !user.isOnDuty : true;
    setUser((prev) => (prev ? { ...prev, isOnDuty: newDuty } : null));
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { isOnDuty: newDuty });
      } catch (err) {
        console.warn('Failed to toggle duty in Firestore:', err);
      }
    }
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
