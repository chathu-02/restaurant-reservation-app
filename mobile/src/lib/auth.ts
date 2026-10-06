import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type Role = "customer" | "manager" | "front" | "kitchen";

export function friendlyError(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "That email address does not look right.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try logging in.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    case "auth/network-request-failed":
      return "No internet connection. Check your network and try again.";
    case "app/no-profile":
      return "We could not find your profile. Please contact the restaurant.";
    case "app/inactive":
      return "This account has been deactivated.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export async function registerCustomer(
  name: string,
  email: string,
  phone: string,
  password: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await setDoc(doc(db, "users", cred.user.uid), {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: "customer",
    active: true,
    createdAt: serverTimestamp(),
  });
}

export async function login(email: string, password: string): Promise<Role> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));
  if (!snap.exists()) {
    await signOut(auth);
    throw Object.assign(new Error("no profile"), { code: "app/no-profile" });
  }
  const data = snap.data();
  if (data.active === false) {
    await signOut(auth);
    throw Object.assign(new Error("inactive"), { code: "app/inactive" });
  }
  return data.role as Role;
}

export function sendReset(email: string) {
  return sendPasswordResetEmail(auth, email.trim());
}

export function logout() {
  return signOut(auth);
}

// Where each role lands after login. Staff and kitchen routes are for the
// teammates who build those areas to create.
export function homeRouteFor(role: Role): string {
  switch (role) {
    case "manager":
    case "front":
      return "/staff";
    case "kitchen":
      return "/kitchen";
    default:
      return "/home";
  }
}