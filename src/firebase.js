// Firebase app, Firestore and Auth singletons.
// Lives outside main.jsx so pages can import `db` / `auth` without pulling in
// the router tree (main.jsx still re-exports `db` for the older callers).
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCj5vDpUUC-LYsn_qzQocrIbhz4yys-UL0",
  authDomain: "linktree-c2e43.firebaseapp.com",
  projectId: "linktree-c2e43",
  storageBucket: "linktree-c2e43.firebasestorage.app",
  messagingSenderId: "1053507136109",
  appId: "1:1053507136109:web:5dacbb69164118e8c9ed64",
  measurementId: "G-CQL9ZVL151",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Admin allowlist, comma separated, from VITE_ADMIN_EMAILS in .env.
// This is a UX gate only — the real enforcement is in firestore.rules, which
// must carry the same list. Never treat this as a security boundary.
export const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminUser(user) {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
