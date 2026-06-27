"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import axiosInstance from "@/lib/axiosInstance";
import { getFirebaseAuth } from "@/lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const syncInFlight = useRef(null);
  const initializing = useRef(true);

  const syncFirebaseUser = useCallback(async (firebaseUser) => {
    if (syncInFlight.current) {
      return syncInFlight.current;
    }

    const syncPromise = (async () => {
      const idToken = await firebaseUser.getIdToken();

      const { data } = await axiosInstance.post("/auth/google-sync", {
        idToken,
        name: firebaseUser.displayName || "User",
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL || "",
      });

      setUser(data.data);
      return data;
    })();

    syncInFlight.current = syncPromise;

    try {
      return await syncPromise;
    } finally {
      syncInFlight.current = null;
    }
  }, []);

  const fetchMe = useCallback(async () => {
    const { data } = await axiosInstance.get("/auth/me");
    setUser(data.data);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe = null;

    const finishLoading = () => {
      if (!cancelled) {
        initializing.current = false;
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        const { auth } = getFirebaseAuth();

        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          await syncFirebaseUser(redirectResult.user);
          return;
        }

        try {
          await fetchMe();
          return;
        } catch {
          setUser(null);
        }

        if (auth.currentUser) {
          await syncFirebaseUser(auth.currentUser);
        }
      } catch (error) {
        console.error("[auth] Session initialization failed", error);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        finishLoading();
      }
    };

    try {
      const { auth } = getFirebaseAuth();

      initializeAuth();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (initializing.current) {
          return;
        }

        if (!firebaseUser) {
          return;
        }

        try {
          await syncFirebaseUser(firebaseUser);
        } catch (error) {
          console.error("[auth] Failed to sync Firebase user", error);
        }
      });
    } catch {
      finishLoading();
    }

    return () => {
      cancelled = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [syncFirebaseUser, fetchMe]);

  const register = async ({ name, email, password, photoURL = "" }) => {
    const { data } = await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      photoURL,
    });
    setUser(data.data);
    return data;
  };

  const login = async ({ email, password }) => {
    const { data } = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    setUser(data.data);
    return data;
  };

  const logout = async () => {
    await axiosInstance.post("/auth/logout");

    try {
      const { auth } = getFirebaseAuth();
      await signOut(auth);
    } catch {
      // Ignore Firebase logout errors; the API cookie is already cleared.
    }

    setUser(null);
  };

  const googleLogin = async () => {
    const { auth, googleProvider } = getFirebaseAuth();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      return await syncFirebaseUser(result.user);
    } catch (error) {
      if (
        error?.code === "auth/popup-blocked" ||
        error?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, googleProvider);
        return { redirected: true };
      }

      throw error;
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout,
      googleLogin,
      refetchUser: fetchMe,
    }),
    [user, loading, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
