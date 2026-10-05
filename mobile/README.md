# 🍽️ Restaurant Reservation & Queue App — Staff Mobile Frontend

Mobile-first restaurant reservation, queue management, and staff operations frontend built with **React + Vite**, **React Router**, and **Tailwind CSS**.

Developed for **IT3060 Human Computer Interaction — Milestone 03** on branch `feature/customer-staff`.

---

## 📱 Implemented High-Fidelity Interfaces

This frontend recreation implements all 4 assigned interfaces from the high-fidelity UI prototypes:

1. **Staff Sign In (`/login`)** — Matching Prototype Screen 1
   - Brand logo badge with `STAFF ACCESS` indicator.
   - Form with client-side validation for Staff Email/ID and Password.
   - Password visibility toggle (eye / eye-off).
   - Sign In action with loading indicator and direct authentication.
   - Quick Fill test accounts (Manager Kaweerna & Staff Jane).
   - "Trouble signing in?" assistance card with modal overlay.

2. **Staff Dashboard Overview (`/dashboard`)** — Matching Prototype Screen 2
   - Active shift badge ("Dinner Service • Shift A") and profile avatar with online status indicator.
   - Current date & greeting ("Today, Wednesday, June 12").
   - 2x2 Key Operational Metrics grid:
     - **Reservations today** (24, `+14%`)
     - **Guests in queue** (6, `~12m wait`)
     - **Tables occupied** (12/20 with visual progress bar)
     - **No-shows** (2, `Low` badge)
   - Dinner Rush Alert card ("Rush expected 7:30 PM • 48 covers reserved") with interactive **View slots** capacity modal.
   - Action buttons:
     - **Walk-in**: Register walk-in guest to live queue (CRUD Create).
     - **+ New Booking**: Comprehensive reservation booking modal (CRUD Create).
     - **Manage**: Shift overrides and table capacity forecast.
   - Manager tools section: Direct navigation to **Staff Accounts** and **Restaurant Settings**.
   - 5-tab bottom navigation bar (`Dashboard`, `Reservations`, `Tables`, `Queue`, `Alerts`).

3. **Staff Accounts Management (`/staff`)** — Matching Prototype Screen 3
   - Top header with dynamic member counts ("X team members • Y active").
   - Add new staff account button (`+`) opening modal form.
   - Real-time search by name, role, department, or staff ID (`⌘K`).
   - Category filter tabs: `All`, `Active`, `Managers`, `Kitchen`.
   - Dinner Shift Roster banner with active clock count.
   - **Full Working CRUD Operations**:
     - **Create**: Add new staff member with name, role, station, duty status, and code.
     - **Read**: Dynamic list with avatars, roles, duty status, and search/filter.
     - **Update**: Edit staff details via pencil button, or toggle `On duty` / `Off duty` in real-time.
     - **Delete**: Remove staff member from roster with confirmation modal.
     - Empty state with reset filters button if search returns no results.

4. **Profile & Settings (`/profile`)** — Matching Prototype Screen 4
   - Header with Staff ID `#MGR-4082` and edit profile button.
   - Profile Hero Card featuring:
     - Manager avatar photo (Kaweerna Sneha) with camera icon.
     - "On Shift" interactive status toggle pill.
     - Name, email, "General Manager" and "Floor & Service • Shift A" pills.
     - 3-column operational stats: **RATING 4.9 ★**, **COMPLETED 142 Shifts**, **FLOOR Zone A**.
   - **Account & Security**:
     - Personal Details edit modal with validation (CRUD Update).
     - Security & Passcode (PIN/passcode update modal).
     - Shift Alerts & Sound (On/Off toggle switch).
   - **Preferences & Support**:
     - Table & Floor Map (Interactive floor visualizer for Zone A).
     - Help & Manager Desk (Hotline, emergency override code, handover checklist).
   - **Log Out of Session** button returning to sign-in.
   - Footer: `Stitch POS v2.4.1 • Terminal #04 • Synced`.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite 6 (Fast HMR & optimal production bundling)
- **Routing**: React Router v6 (`BrowserRouter` with route navigation)
- **Styling**: Tailwind CSS v3 + Custom design tokens matching prototype
- **Icons**: Lucide React
- **State Management & Persistence**: React Context API (`AuthContext`, `StaffContext`, `ToastContext`) + LocalStorage with seamless backend API fallbacks
- **Backend API Integration**: Node.js + Express REST API endpoints (`/api/staff`, `/api/auth`, `/api/dashboard`, `/api/reservations`, `/api/queue`)

---

## 🚀 How to Run the Application

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Frontend Setup
```bash
cd mobile
npm install
npm run dev
```
Open your browser at `http://localhost:3000` (or the port displayed in terminal).

### 3. Production Build
```bash
cd mobile
npm run build
npm run preview
```

### 4. Running the Backend API (Optional)
```bash
cd ../backend
npm install
npm run start
```
The frontend automatically connects to the backend on `http://localhost:5000/api` if running, and seamlessly falls back to persistent local storage if offline.

---

## 🔍 Desktop & Mobile View Modes

When running on desktop, a **Device Frame Bar** is provided at the top:
- Switch directly between screens:
  - `1. Staff Sign In`
  - `2. Staff Dashboard`
  - `3. Staff Accounts`
  - `4. Profile & Settings`
- Toggle between **Phone Frame Mode** (realistic mobile device bezel) and **Full Responsive View**.

---

## 📋 CRUD Operations Summary

| Interface | Operation | Trigger | Details |
|---|---|---|---|
| **Staff Accounts** | **Create** | Click `+` button in top right | Adds new staff member with code, name, role, station, duty status |
| **Staff Accounts** | **Read** | Screen load / search / filter | Reads roster, filters by All / Active / Managers / Kitchen, live search query |
| **Staff Accounts** | **Update** | Pencil icon or duty toggle switch | Modifies member details or switches duty state |
| **Staff Accounts** | **Delete** | Trash icon on member card | Deletes member with confirmation modal |
| **Profile & Settings** | **Read** | Screen load | Displays manager stats, rating, shift info, floor assignment |
| **Profile & Settings** | **Update** | Edit button or Personal Details item | Updates contact info, name, floor, shift assignment with validation |
| **Profile & Settings** | **Update** | On Shift pill or Alerts row | Toggles shift status and sound alerts |
| **Dashboard** | **Create** | `+ New Booking` button | Adds reservation with guest details, party size, and time |
| **Dashboard** | **Create** | `Walk-in` button | Adds guest to waiting queue with estimated wait time |
