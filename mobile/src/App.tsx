import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StaffProvider } from './context/StaffContext';
import { MobileFrame } from './components/layout/MobileFrame';
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { StaffAccountsPage } from './pages/StaffAccountsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <StaffProvider>
          <BrowserRouter>
            <MobileFrame>
              <Routes>
                {/* 1. Staff Sign In (Screenshot 1) */}
                <Route path="/login" element={<SignInPage />} />

                {/* 2. Staff Dashboard Overview (Screenshot 2) */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* 3. Staff Accounts Management (Screenshot 3) */}
                <Route path="/staff" element={<StaffAccountsPage />} />

                {/* 4. Profile & Settings (Screenshot 4) */}
                <Route path="/profile" element={<ProfileSettingsPage />} />

                {/* Root default & fallback */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MobileFrame>
          </BrowserRouter>
        </StaffProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
