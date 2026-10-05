import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StaffProvider } from './context/StaffContext';
import { CustomerProvider } from './context/CustomerContext';
import { MobileFrame } from './components/layout/MobileFrame';

// Staff Pages
import { SignInPage } from './pages/SignInPage';
import { DashboardPage } from './pages/DashboardPage';
import { StaffAccountsPage } from './pages/StaffAccountsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';

// Customer Pages
import { JoinQueuePage } from './pages/customer/JoinQueuePage';
import { YourQueuePage } from './pages/customer/YourQueuePage';
import { NotificationsPage } from './pages/customer/NotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <StaffProvider>
          <CustomerProvider>
            <BrowserRouter>
              <MobileFrame>
                <Routes>
                  {/* Customer Portal Routes */}
                  <Route path="/join-queue" element={<JoinQueuePage />} />
                  <Route path="/queue" element={<YourQueuePage />} />
                  <Route path="/alerts" element={<NotificationsPage />} />
                  <Route path="/customer-profile" element={<CustomerProfilePage />} />

                  {/* Staff Portal Routes */}
                  <Route path="/login" element={<SignInPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/staff" element={<StaffAccountsPage />} />
                  <Route path="/profile" element={<ProfileSettingsPage />} />

                  {/* Default Route: Customer Join Queue */}
                  <Route path="/" element={<Navigate to="/join-queue" replace />} />
                  <Route path="*" element={<Navigate to="/join-queue" replace />} />
                </Routes>
              </MobileFrame>
            </BrowserRouter>
          </CustomerProvider>
        </StaffProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
