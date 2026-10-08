# Restaurant Reservation Mobile App

React Native mobile application built with Expo SDK 57 and Expo Router for
restaurant customers and staff.

## Run locally

Install dependencies from the repository root:

```bash
cd mobile
npm install
```

Create `mobile/.env` from `mobile/.env.example` and set the API URL for the
device or emulator you are using. The backend runs on port `5000` by default.

Start the backend in a separate terminal:

```bash
cd backend
npm install
npm start
```

Start Expo:

```bash
cd mobile
npm start
```

Use `w` for web, `a` for Android, `i` for iOS, or scan the QR code with Expo
Go. A physical device and the computer running the backend must be on the same
network.

## Checks

```bash
cd mobile
npx tsc --noEmit
npm run lint
```

## Project structure

- `src/app`: Expo Router screens and navigation layouts
- `src/components`: reusable UI components
- `src/constants`: theme and status constants
- `src/hooks`: authentication and reservation hooks
- `src/services`: backend API clients
- `assets`: application images and icons
