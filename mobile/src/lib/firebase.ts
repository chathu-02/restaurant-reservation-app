import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getAuth, Auth } from "firebase/auth";
// @ts-ignore - exists in the React Native build of firebase/auth
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAF8yqPHlsxz0A6-XqD2A1XbSzYvfFdB-8",
  authDomain: "restaurant-reservation-a-a7518.firebaseapp.com",
  projectId: "restaurant-reservation-a-a7518",
  storageBucket: "restaurant-reservation-a-a7518.firebasestorage.app",
  messagingSenderId: "32749484984",
  appId: "1:32749484984:web:6e47c6927586a5fa0c6d4d",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);