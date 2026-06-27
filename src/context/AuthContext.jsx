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
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import axiosInstance from "@/lib/axiosInstance";
import { getFirebaseAuth } from "@/lib/firebase";
import { saveAuthRedirect } from "@/utils/authSession";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingGoogle, setCompletingGoogle] = useState(false);
  const [authError, setAuthError] = useState(null);
  const syncInFlight = useRef(null);
  const initializing = useRef(true);

  const syncFirebaseUser = useCallback(async (firebaseUser) => {
    if (syncInFlight.current) {
      return syncInFlight.current;
    }

    const syncPromise = (async () => {
      const idToken = await firebaseUser.getIdToken(true);

      const { data } = await axiosInstance.post("/auth/google-sync", {
        idToken,
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
        setCompletingGoogle(false);
      }
    };

    const initializeAuth = async () => {
      try {
        const { auth } = getFirebaseAuth();

        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          if (!cancelled) {
            setCompletingGoogle(true);
            setAuthError(null);
          }
          await syncFirebaseUser(redirectResult.user);
          return;
        }

        try {
          await fetchMe();
          return;
        } catch {
          if (!cancelled) {
            setUser(null);
          }
        }

        if (auth.currentUser) {
          await syncFirebaseUser(auth.currentUser);
        }
      } catch (error) {
        console.error("[auth] Session initialization failed", error);
        if (!cancelled) {
          setUser(null);
          setAuthError(
            error?.response?.data?.message ||
              error?.message ||
              "Could not restore your session."
          );
        }
      } finally {
        finishLoading();
      }
    };

    try {
      const { auth } = getFirebaseAuth();

      initializeAuth();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (initializing.current || !firebaseUser) {
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
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // Continue clearing local session even if the API call fails.
    }

    try {
      const { auth } = getFirebaseAuth();
      await signOut(auth);
    } catch {
      // Ignore Firebase logout errors.
    }

    setUser(null);
  };

  const googleLogin = async (redirectPath) => {
    const { auth, googleProvider } = getFirebaseAuth();

    saveAuthRedirect(redirectPath);
    await signInWithRedirect(auth, googleProvider);
    return { redirected: true };
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      completingGoogle,
      authError,
      clearAuthError: () => setAuthError(null),
      register,
      login,
      logout,
      googleLogin,
      refetchUser: fetchMe,
    }),
    [user, loading, completingGoogle, authError, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
