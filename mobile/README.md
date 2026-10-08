# 🍽️ Restaurant Reservation & Shift Management Mobile App

A modern, high-fidelity React Native (Expo) mobile application designed for restaurant managers, shift leads, hosts, floor staff, and customers.

---

## 📱 Features

### 🛡️ Staff Portal Interfaces
- **Shift Overview Dashboard**: Live reservations, waitlist queue, table occupancy bar, and no-show metrics.
- **Dinner Rush Projections**: Real-time rush banner with expected guest count and interval alerts.
- **Fast Quick Actions**: Walk-in queue intake, New Booking reservation modal with instant updates, and Floor Management.
- **Staff Accounts Management**: Full CRUD for team members with live search and duty toggles.
- **Manager Tools**: Quick access to staff on duty, restaurant settings, table setup/floor plan, and analytics.
- **Bottom Navigation**: Seamless tab navigation across Dashboard, Bookings, Tables, Waitlist, and Alerts.

### 🌟 Customer Portal Interfaces
- **Join the Queue**: Select party size, seating preference, and get a live position tracking SMS notification guarantee.
- **Live Queue Tracking**: Real-time position tracking, wait time estimation, and turnover pace badge.
- **Customer Notifications**: Priority alerts for when a table is ready or bookings change.
- **Customer Profile**: Personal details, payment methods, preferences, and queue save history.

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
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npx expo start
```

### 4. How to Connect & Run in Expo Go

- **On Android**: Open the **Expo Go** app, tap **"Scan QR code"**, and point your camera at the QR code in the terminal.
- **On iPhone**: Open the default **Camera** app, point it at the QR code in the terminal, and tap the **"Open in Expo Go"** banner.
- **Web / Simulator**:
  - Press `w` in the terminal to open in your web browser.
  - Press `a` to launch Android Emulator.
  - Press `i` to launch iOS Simulator.

*(Make sure your phone and computer are connected to the same Wi-Fi network).*

---

## 📁 Project Structure

```
mobile/
├── assets/
│   └── images/
├── src/
│   ├── app/
│   │   ├── _layout.tsx             # Root stack navigator & theme
│   │   ├── index.tsx               # Central Launchpad Hub
│   │   ├── (auth)/                 # Customer authentication
│   │   ├── (customer)/             # Customer app screens
│   │   └── (staff)/                # Staff app screens
│   ├── components/
│   │   └── ui/                     # Reusable UI controls
│   ├── constants/
│   ├── hooks/
│   └── services/
├── app.json                        # Expo configuration
├── package.json                    # Dependencies & scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🛠️ Technology Stack

- **Framework**: React Native 0.86.3
- **Platform**: Expo SDK 57
- **Routing**: Expo Router v57 (File-based navigation)
- **Vector Icons**: `@expo/vector-icons`
- **Safe Area**: `react-native-safe-area-context`
