<<<<<<< HEAD
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
=======
# 🍽️ Restaurant Reservation & Queue App — Expo Go Mobile App

High-fidelity mobile restaurant reservation, live queue tracking, and staff management mobile app built with **React Native**, **Expo (SDK 57)**, and **Expo Router**.

Developed for **IT3060 Human Computer Interaction — Milestone 03** on branch `feature/customer-staff`.

---

## 📲 How to Connect & Run in Expo Go

### Step 1: Install Expo Go on your Physical Phone
- **Android**: Download **Expo Go** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).
- **iPhone / iOS**: Download **Expo Go** from the [Apple App Store](https://apps.apple.com/app/expo-go/id982107779).

*(Make sure your phone and computer are connected to the same Wi-Fi network).*

### Step 2: Start the Expo Development Server
In your terminal, navigate to the `mobile` folder and start Expo:

```bash
cd mobile
npm start
```
*(Or `npx expo start`)*

### Step 3: Scan the QR Code
- **On Android**: Open the **Expo Go** app, tap **"Scan QR code"**, and point your camera at the QR code in the terminal.
- **On iPhone**: Open the default **Camera** app, point it at the QR code in the terminal, and tap the **"Open in Expo Go"** banner.

### Step 4: Web / Simulator Options (Optional)
You can also run directly on your computer:
- Press `w` in the terminal to open in your web browser.
- Press `a` to launch Android Emulator (if Android Studio is installed).
- Press `i` to launch iOS Simulator (on macOS with Xcode).

---

## 📱 All 8 Implemented Screens & Features

When you open the app in Expo Go, the **Central Launch Hub (`/`)** displays one-tap launch buttons for all 8 screens:

### 🌟 Part A: Customer Portal Interfaces (4 Screens)

1. **Join the Queue (`/join-queue`)** — *Customer Screenshot 1*
   - Location header (*The Green Terrace • Riverside Ave*) with `LIVE` status pill.
   - Wait time banner (*Current wait ~20 min • 6 groups ahead • FAST TURN*).
   - Full Name input with user icon.
   - Phone Number input with country code badge (`us +1`) and SMS notification helper.
   - Party Size stepper counter (`[-] 2 [+]`) and quick-select pills (`2 ppl`, `4 ppl`, `6 ppl`, `8+ ppl`).
   - Seating Preference cards (`Indoor`, `Outdoor`, `Any table / Fastest`).
   - Special Requests field.
   - SMS notification guarantee banner.
   - Estimated seating time (`~10:05 PM`) and `Join Queue ->` button with success alert.

2. **Your Queue / Live Queue Tracking (`/queue`)** — *Customer Screenshot 2*
   - Live pulsing queue tracker header with alert bell.
   - Position hero card:
     - Giant position indicator (`3` with `#3` pill badge).
     - Estimated wait `~15 min` pill.
     - Progress bar showing table clearance (`2 tables ahead`, `65%` filled).
     - Turnover pace badge: `Fast (~4 min/table)`.
   - 3 Quick Details cards: `PARTY: 2 Guests`, `JOINED: 6:40 PM`, `SEATING: Indoor`.
   - Ready status alert banner with `SMS` indicator and live floor status.
   - **Explore Menu & Daily Specials** interactive dish modal.
   - **Leave Queue** button with confirmation alert.
   - 5-tab customer navigation bar (`Home`, `Bookings`, `Queue`, `Alerts`, `Profile`).

3. **Customer Notifications (`/alerts`)** — *Customer Screenshot 3*
   - Header with dynamic unread count pill badge (`2 new`) and **Mark all as read** action.
   - **TODAY** section:
     - Priority Alert: *Your table is ready! Head to host stand within 10 minutes* (`Ready now` button).
     - Booking Reminder: *Tomorrow 7:00 PM • Table for 4 at The Green Terrace*.
     - Update: *Booking time changed to 8:15 PM*.
   - **EARLIER** section:
     - *Booking confirmed: #RB-20481 • 14 Jun, 6:30 PM*.
     - *Queue update: Moved up to position #3 in line*.
   - Interactive notification modal on card tap.
   - 5-tab customer navigation bar.

4. **Customer Profile & Settings (`/customer-profile`)** — *Customer Screenshot 4*
   - Profile Hero Card featuring:
     - Amara Chen photo with camera overlay.
     - Name & email (`amara.chen@email.com`).
     - Loyalty badge: `PREFERRED GUEST • 18 VISITS`.
     - 3-column stats: **12 Bookings**, **8 Queue Saves**, **450 Points**.
   - Account Settings:
     - *Edit personal details* modal.
     - *Change password* modal.
     - *Payment methods* modal.
   - Preferences:
     - *Reminders*: Upcoming bookings toggle switch.
     - *Queue alerts*: Position change toggle switch.
   - **Log Out of Account Button** *(Explicitly Requested)*:
     - Red-tinted `Log Out of Account` button at bottom with confirmation alert dialog.

---

### 🛡️ Part B: Staff Portal Interfaces (4 Screens)

1. **Staff Sign In (`/login`)** — *Staff Screenshot 1*
   - Centered dark box with mint fork & knife icon and `STAFF ACCESS` badge.
   - "Staff sign in" title & subtitle.
   - Staff email or ID input.
   - Password input with secure text entry eye toggle and "Forgot password?" modal.
   - "Sign In" dark button with green arrow.
   - **Quick Fill** test buttons:
     - `Manager (Kaweerna)`
     - `Staff (Jane)`
   - "Trouble signing in?" assistance card with hotline modal.

2. **Staff Dashboard Overview (`/dashboard`)** — *Staff Screenshot 2*
   - Active shift pill (`Dinner Service • Shift 2`) and Kaweerna Sneha's avatar with on-shift dot.
   - 2×2 Operational metrics grid:
     - *Reservations today* (`24`, `+12%` green badge)
     - *Guests in queue* (`6`, `18 min wait` badge)
     - *Tables occupied* (`12/20`, 60% progress bar)
     - *No-shows* (`2`, `Low (4%)` badge)
   - Rush alert card (*Dinner rush forecast • Peak 7:30 PM • 85% reserved*) with **View Rush Slots** modal.
   - Quick Action buttons:
     - **Walk-in**: Add walk-in guest modal.
     - **New Booking**: Table reservation modal.
     - **Manage**: Shift roster and capacity forecast modal.
   - Manager tools: Staff Accounts roster, Table Layout, Restaurant Settings.
   - 5-tab staff bottom navigation bar.

3. **Staff Accounts Management (`/staff-accounts`)** — *Staff Screenshot 3*
   - Header with dynamic roster counts (*4 team members • 3 active*) and Add Staff button (`+`).
   - Live search input (`⌘K`) filtering by name, role, and station.
   - Category filter tabs: `All (4)`, `Active (3)`, `Managers (1)`, `Kitchen (2)`.
   - Dinner Shift Roster banner showing active on-duty count.
   - **Full Working CRUD Operations**:
     - **Create**: Add new staff member with name, role, department, and station.
     - **Read**: Live member cards (Jane Doe, Mark Smith, Alex Lee, Rachel Wong).
     - **Update**: Edit details via modal, or toggle on-duty/off-duty switch in real time.
     - **Delete**: Remove staff member with confirmation dialog.

4. **Staff Profile & Settings (`/staff-profile`)** — *Staff Screenshot 4*
   - Header with Staff ID `#ST-8821` and edit button.
   - Hero Card featuring Kaweerna Sneha's photo, `On Shift • Duty` toggle pill, and 3-column stats (**4.9 ★ Rating**, **142 Shifts**, **Zone A Station**).
   - Account & Security: Personal Details modal, Security PIN modal, Shift Alerts & Sound toggle.
   - Preferences & Support: Zone A Table & Floor Map visualizer, Help & Manager Desk hotline.
   - Red **Log Out of Session** button with confirmation dialog.

---

## 📁 Project Structure

```
mobile/
├── assets/
│   └── images/
│       ├── staff_avatar.jpg        # Kaweerna Sneha staff portrait
│       └── icon.png
├── src/
│   ├── app/
│   │   ├── _layout.tsx             # Root stack navigator & theme
│   │   ├── index.tsx               # Central Launchpad Hub for Expo Go
│   │   ├── join-queue.tsx          # Customer Screen 1: Join Queue
│   │   ├── queue.tsx               # Customer Screen 2: Live Queue Tracker
│   │   ├── alerts.tsx              # Customer Screen 3: Notifications
│   │   ├── customer-profile.tsx    # Customer Screen 4: Customer Profile & Logout
│   │   ├── login.tsx               # Staff Screen 1: Staff Sign In
│   │   ├── dashboard.tsx           # Staff Screen 2: Staff Dashboard
│   │   ├── staff-accounts.tsx      # Staff Screen 3: Staff Accounts (CRUD)
│   │   └── staff-profile.tsx       # Staff Screen 4: Staff Profile & Settings
│   └── components/
│       └── ui/
│           └── Icon.tsx            # Cross-platform Expo Vector Icons wrapper
├── app.json                        # Expo configuration
├── package.json                    # Dependencies & Expo SDK 57 scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🛠️ Technology Stack

- **Framework**: React Native 0.86.3
- **Platform**: Expo SDK 57
- **Routing**: Expo Router v57 (File-based navigation)
- **Vector Icons**: `@expo/vector-icons` (Ionicons, Feather, MaterialCommunityIcons, MaterialIcons)
- **Safe Area**: `react-native-safe-area-context`
- **Screens**: `react-native-screens`
>>>>>>> origin/feature/customer-staff
