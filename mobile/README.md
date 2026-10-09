# Restaurant Reservation & Shift Management Mobile App

A modern, high-fidelity React Native (Expo) mobile application designed for restaurant managers, shift leads, hosts, and floor staff.

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

Press:
- `w` to open in Web Browser
- `a` to open in Android Emulator
- `i` to open in iOS Simulator
- Scan the QR code with **Expo Go** on Android or iOS
