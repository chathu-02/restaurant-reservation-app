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
