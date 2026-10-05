# 🍽️ Restaurant Reservation & Queue App — Customer & Staff Mobile Frontend

Mobile-first restaurant reservation, queue tracking, and staff management frontend built with **React + Vite**, **React Router**, and **Tailwind CSS**.

Developed for **IT3060 Human Computer Interaction — Milestone 03** on branch `feature/customer-staff`.

---

## 📱 Implemented High-Fidelity Interfaces

### 🌟 Part A: Customer Portal Interfaces

1. **Join the Queue (`/join-queue`)** — Matching Customer Prototype Screen 1
   - Header with restaurant location (*The Green Terrace • Riverside Ave*) and `LIVE` status pill.
   - Wait time banner card (*Current wait ~20 min • 6 groups ahead • FAST TURN*).
   - Form with client-side validation:
     - Full Name input (with user icon).
     - Phone Number input with country code badge (`us +1`) and SMS update helper.
     - Party Size stepper counter (`[-] 2 [+]`) and quick-select pills (`2 ppl`, `4 ppl`, `6 ppl`, `8+ ppl`).
     - Seating Preference cards (`Indoor`, `Outdoor`, `Any table / Fastest`).
     - Special Requests input field.
   - SMS notification assurance banner (*5 minutes away notification*).
   - Estimated seating time indicator (`~10:05 PM`) and prominent `Join Queue ->` button (CRUD Create).

2. **Your Queue / Live Queue Tracking (`/queue`)** — Matching Customer Prototype Screen 2
   - Header with live pulsing queue tracker indicator and notification quick-access bell.
   - Position hero card:
     - Giant position indicator (`3` with `#3` pill badge).
     - "Estimated wait ~15 min" dark pill indicator.
     - Progress bar showing table clearance (`2 tables ahead`, `65%` filled).
     - Turnover pace badge: `Fast (~4 min/table)`.
   - 3 Quick Details cards: `PARTY: 2 Guests`, `JOINED: 6:40 PM`, `SEATING: Indoor`.
   - Ready status alert banner with `SMS` indicator and live floor status.
   - Action buttons:
     - **Explore Menu & Daily Specials** (opens interactive dish modal).
     - **Leave Queue** (CRUD Delete with confirmation modal).
   - Customer bottom navigation bar (`Home`, `Bookings`, `Queue`, `Alerts`, `Profile`).

3. **Notifications (`/alerts`)** — Matching Customer Prototype Screen 3
   - Header with dynamic unread count pill badge (`2 new`) and **Mark all as read** action.
   - Section **TODAY** (14 Jun 2025):
     - Priority Alert: *Your table is ready! Head to host stand within 10 minutes* (`Ready now` button).
     - Booking Reminder: *Tomorrow 7:00 PM • Table for 4 at The Green Terrace*.
     - Update: *Booking time changed to 8:15 PM*.
   - Section **EARLIER**:
     - *Booking confirmed: #RB-20481 • 14 Jun, 6:30 PM*.
     - *Queue update: Moved up to position #3 in line*.
   - Interactive notification modal with host stand guidance upon card tap.

4. **Customer Profile & Settings (`/customer-profile`)** — Matching Customer Prototype Screen 4
   - Header with Edit Profile icon.
   - Profile Hero Card featuring:
     - Customer photo (Amara Chen) with camera overlay icon.
     - Name & email (`amara.chen@email.com`).
     - Loyalty badge: `PREFERRED GUEST • 18 VISITS`.
     - 3-column stats: **12 Bookings**, **8 Queue Saves**, **450 Points** (emerald).
   - **Account Settings**:
     - *Edit personal details* (CRUD Update with full form validation).
     - *Change password* (password update modal with validation).
     - *Payment methods* (saved cards modal with default pre-authorization card).
   - **Preferences**:
     - Expandable *Notification settings* accordion:
       - *Reminders*: Upcoming bookings 2h & 24h prior (interactive toggle switch).
       - *Queue alerts*: Position changes and table calls (interactive toggle switch).
   - **Logout of Account Button** (Requested Feature):
     - Prominent red-tinted `Log Out of Account` button at bottom with confirmation modal.

---

### 🛡️ Part B: Staff Portal Interfaces

1. **Staff Sign In (`/login`)** — Matching Staff Prototype Screen 1
   - Centered logo card with mint fork & knife icon and `STAFF ACCESS` pill.
   - Email/ID and Password validation with password toggle (`Eye` / `EyeOff`).
   - Quick Fill test buttons for Manager (*Kaweerna*) and Staff (*Jane*).
   - "Trouble signing in?" assistance card with hotline modal.

2. **Staff Dashboard Overview (`/dashboard`)** — Matching Staff Prototype Screen 2
   - Active shift pill (`Dinner Service • Shift A`) and manager avatar with online dot.
   - 2×2 Operational metrics grid:
     - *Reservations today* (24, `+14%`)
     - *Guests in queue* (6, `~12m wait`)
     - *Tables occupied* (12/20 progress bar)
     - *No-shows* (2, `Low`)
   - Rush alert card (*Rush expected 7:30 PM • 48 covers*) with **View slots** capacity modal.
   - Quick Action buttons:
     - **Walk-in**: Add guest to queue (CRUD Create).
     - **+ New Booking**: Table reservation modal (CRUD Create).
     - **Manage**: Shift overrides and table capacity forecast.
   - Manager tools section: Navigates to Staff Accounts and Restaurant Settings.
   - 5-tab staff navigation bar (`Dashboard`, `Reservations`, `Tables`, `Queue`, `Alerts`).

3. **Staff Accounts Management (`/staff`)** — Matching Staff Prototype Screen 3
   - Top header with dynamic roster counts (*X team members • Y active*) and Add Staff button (`+`).
   - Live search input (`⌘K`) filtering by name, role, department, or staff ID.
   - Category filter tabs: `All`, `Active`, `Managers`, `Kitchen`.
   - Dinner Shift Roster banner showing active on-duty count.
   - **Full Working CRUD Operations**:
     - **Create**: Add new staff account with code, name, role, station, duty status.
     - **Read**: Live member cards (Jane Doe, Mark Smith, Alex Lee, Rachel Wong).
     - **Update**: Edit details via pencil modal, or click `On duty` / `Off duty` toggle switch.
     - **Delete**: Remove staff member with confirmation modal.
     - Empty state with reset filters button if search yields no results.

4. **Staff Profile & Settings (`/profile`)** — Matching Staff Prototype Screen 4
   - Header with Staff ID `#MGR-4082` and edit profile button.
   - Hero Card featuring Kaweerna Sneha's photo, `On Shift` toggle pill, and 3-column stats (**4.9 ★ Rating**, **142 Shifts**, **Zone A**).
   - Account & Security: Personal Details edit modal, Security PIN modal, Shift Alerts & Sound toggle.
   - Preferences & Support: Zone A Table & Floor Map visualizer, Help & Manager Desk hotline.
   - Red **Log Out of Session** button.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 6 (Fast HMR & optimal production bundling)
- **Routing**: React Router v6 (`BrowserRouter` with route navigation)
- **Styling**: Tailwind CSS v3 + Custom design tokens matching prototype
- **Icons**: Lucide React
- **State Management & Persistence**: React Context API (`CustomerContext`, `AuthContext`, `StaffContext`, `ToastContext`) + LocalStorage with automatic backend API fallback
- **Backend API Integration**: Node.js + Express REST API endpoints (`/api/staff`, `/api/auth`, `/api/dashboard`, `/api/reservations`, `/api/queue`)

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Run Frontend
```bash
cd mobile
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 3. Production Build
```bash
cd mobile
npm run build
npm run preview
```

### 4. Desktop Presentation & Device View Modes
When running in a desktop browser:
- Use the **Desktop Header Bar** to immediately switch between:
  - **Customer Portal**: `1. Join Queue`, `2. Your Queue`, `3. Alerts`, `4. Profile & Settings`
  - **Staff Portal**: `1. Staff Sign In`, `2. Staff Dashboard`, `3. Staff Accounts`, `4. Profile & Settings`
- Toggle between **Phone Frame View** (realistic mobile device bezel) and **Full Responsive View**.

### 5. Running the Backend API (Optional)
```bash
cd ../backend
npm install
npm run start
```
The frontend connects automatically to `http://localhost:5000/api` when available, and falls back to persistent local storage when offline.

---

## 📋 CRUD Operations Summary

| Portal | Interface | Operation | Trigger | Details |
|---|---|---|---|---|
| **Customer** | **Join Queue** | **Create** | `Join Queue ->` button | Validates name, phone, party size, seating preference, creates queue ticket |
| **Customer** | **Your Queue** | **Read** | Screen load / queue state | Displays live position `#3`, wait time, tables ahead, and floor progress |
| **Customer** | **Your Queue** | **Delete** | `Leave Queue` button | Releases position with confirmation modal |
| **Customer** | **Notifications** | **Read** | Screen load / alert tab | Displays table ready alerts and booking reminders with unread badges |
| **Customer** | **Notifications** | **Update** | `Mark all as read` | Clears unread badge count |
| **Customer** | **Profile** | **Read** | Screen load | Displays guest loyalty status, bookings count, and loyalty points |
| **Customer** | **Profile** | **Update** | `Edit personal details` | Updates name, email, phone with validation |
| **Customer** | **Profile** | **Update** | Toggle switches | Toggles Reminders and Queue alerts |
| **Customer** | **Profile** | **Session** | `Log Out of Account` | Confirms and ends customer session |
| **Staff** | **Staff Accounts** | **Create** | `+` header button | Provisions staff account with role, station, code |
| **Staff** | **Staff Accounts** | **Read** | Screen load / search / filter | Reads roster, filters by role & duty, live search |
| **Staff** | **Staff Accounts** | **Update** | Pencil icon or duty toggle | Modifies member details or switches duty state |
| **Staff** | **Staff Accounts** | **Delete** | Trash icon on member card | Deletes member with confirmation modal |
| **Staff** | **Dashboard** | **Create** | `+ New Booking` / `Walk-in` | Books table or registers walk-in guest |
| **Staff** | **Profile** | **Update** | `Edit personal details` | Updates manager station, floor, and shift |
