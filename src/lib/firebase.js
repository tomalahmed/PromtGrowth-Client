import { initializeApp, getApps, getApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let authInstance = null;
let googleProviderInstance = null;
let persistencePromise = null;

export function getFirebaseAuth() {
  if (typeof window === "undefined") {
    throw new Error("Firebase auth is only available in the browser");
  }

  if (!firebaseConfig.apiKey) {
    throw new Error("Firebase is not configured. Add keys to .env.local");
  }

  if (!authInstance) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();
    googleProviderInstance.setCustomParameters({ prompt: "select_account" });
    persistencePromise = setPersistence(authInstance, browserLocalPersistence);
  }

  return {
    auth: authInstance,
    googleProvider: googleProviderInstance,
  };
}

export async function ensureFirebaseReady() {
  getFirebaseAuth();
  if (persistencePromise) {
    await persistencePromise;
  }
  const { auth } = getFirebaseAuth();
  await auth.authStateReady();
  return auth;
}
