# Restaurant Reservation & Shift Management Mobile App

A modern, high-fidelity React Native (Expo) mobile application designed for restaurant managers, shift leads, hosts, and floor staff.

<<<<<<< HEAD
## Run in Expo Go

1. Install dependencies from this directory:
=======
---

## 📱 Features
>>>>>>> origin/feature/staff-management

- **Shift Overview Dashboard**: Live reservations, waitlist queue, table occupancy bar (e.g. 14/20 tables, 70%), and no-show metrics.
- **Dinner Rush Projections**: Real-time rush banner with expected guest count and interval alerts (e.g., Rush expected 7:30 PM with +18 guests).
- **Fast Quick Actions**: Walk-in queue intake, New Booking reservation modal with instant updates, and Floor Management.
- **Manager Tools**: Quick access to staff on duty, restaurant settings, table setup/floor plan, and analytics.
- **Bottom Navigation**: Seamless tab navigation across Dashboard, Bookings, Tables, Waitlist (with live badge), and Alerts.

<<<<<<< HEAD
2. Start the development server:
=======
---
>>>>>>> origin/feature/staff-management

## 📁 Project Structure

<<<<<<< HEAD
3. Install **Expo Go** on your Android or iOS device.
4. Connect the device and computer to the same Wi-Fi network.
5. Scan the QR code shown by the development server from Expo Go. On iOS,
   use the Camera app to scan it; on Android, use the QR scanner in Expo Go.

If the device cannot connect over the local network, use a tunnel:

```bash
npx expo start --tunnel
```

The app routes are stored in `src/app`, which Expo Router detects automatically.
The Firebase-backed sign-in and booking features require an internet connection
when running in Expo Go.

In the output, you'll also find options to open the app in a
=======
| Folder / File | Description | Purpose & Contents |
|---|---|---|
| `src/app/` | Screens & Navigation Layouts | `_layout.tsx`, `index.tsx`, `explore.tsx`, `queue.tsx`, `profile.tsx`, `login.tsx` |
| `src/app/_layout.tsx` | Navigation & Common Providers | Stack navigation, `AuthProvider`, `ThemeProvider` |
| `src/app/index.tsx` | Main Shift Overview Screen | Complete Shift Overview dashboard UI |
| `src/app/explore.tsx` | Reservations & Tables Screen | Filterable reservations list and floor plan overview |
| `src/app/queue.tsx` | Waitlist & Walk-ins Screen | Real-time queue, wait times, notify SMS, and seat actions |
| `src/app/profile.tsx` | Staff Profile & Settings | Duty status toggle, meal service switcher, admin tools |
| `src/app/login.tsx` | Staff Login Screen | Staff authentication & shift sign-in |
| `src/components/` | Reusable UI Components | `Button`, `Input`, `ReservationCard`, `StatusBadge`, `MetricCard`, `RushAlertCard`, `ManagerToolItem`, `BottomNavBar` |
| `src/components/ui/` | Core UI Controls & Icons | Multiplatform `Icon.tsx`, `collapsible.tsx` |
| `src/constants/` | Constant Values & Config | `theme.ts` (colors, spacing, typography), `status.ts` (reservation & shift statuses) |
| `src/hooks/` | Reusable React Hooks | `useAuth` (staff duty & session), `useReservations` (overview metrics & bookings) |
| `src/services/` | Backend API Integration | `api.ts` (fetch client), `reservation.service.ts` (reservations & queue methods) |
| `assets/` | Images, Fonts & Icons | Staff avatar photo (`staff_avatar.jpg`), icons, splash screen |
| `scripts/` | Development Scripts | Project reset and build scripts |
| `app.json` | Expo Configuration | App name, icon, splash, scheme |
| `package.json` | Dependencies & Scripts | Expo 57, React Native 0.86, `@expo/vector-icons` |
| `.env` | Local Environment Config | `EXPO_PUBLIC_API_URL` |
| `.env.example` | Config Placeholders | Base API URL for emulator, web, and device |
| `.gitignore` | Git Ignore List | Ignores `.env`, `node_modules`, `.expo` |
>>>>>>> origin/feature/staff-management

---

## 🚀 Setup & Running Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```env
# Web or iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:5000/api

# Android Emulator
# EXPO_PUBLIC_API_URL=http://10.0.2.2:5000/api

# Physical Device (use your laptop's LAN IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:5000/api
```

### 3. Start Development Server

```bash
npx expo start
```

Press:
- `w` to open in Web Browser
- `a` to open in Android Emulator
- `i` to open in iOS Simulator
- Scan the QR code with **Expo Go** on Android or iOS
