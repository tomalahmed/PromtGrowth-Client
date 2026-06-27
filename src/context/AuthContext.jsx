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
import { ensureFirebaseReady, getFirebaseAuth } from "@/lib/firebase";
import { saveAuthRedirect } from "@/utils/authSession";

export const AuthContext = createContext(null);

const POPUP_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/operation-not-supported-in-this-environment",
]);

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
        const auth = await ensureFirebaseReady();

        if (!cancelled) {
          setCompletingGoogle(sessionStorage.getItem("pg_google_pending") === "1");
        }

        let redirectResult = null;
        try {
          redirectResult = await getRedirectResult(auth);
        } catch (redirectError) {
          console.error("[auth] getRedirectResult failed", redirectError);
        } finally {
          sessionStorage.removeItem("pg_google_pending");
        }

        const firebaseUser = redirectResult?.user ?? auth.currentUser;

        if (firebaseUser) {
          if (!cancelled) {
            setCompletingGoogle(true);
            setAuthError(null);
          }

          try {
            await fetchMe();
            return;
          } catch {
            await syncFirebaseUser(firebaseUser);
            return;
          }
        }

        try {
          await fetchMe();
          return;
        } catch {
          if (!cancelled) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("[auth] Session initialization failed", error);
        sessionStorage.removeItem("pg_google_pending");
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
      initializeAuth();

      ensureFirebaseReady().then((auth) => {
        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (initializing.current || !firebaseUser) {
            return;
          }

          try {
            await fetchMe();
          } catch {
            try {
              await syncFirebaseUser(firebaseUser);
            } catch (error) {
              console.error("[auth] Failed to sync Firebase user", error);
            }
          }
        });
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
    sessionStorage.removeItem("pg_google_pending");

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
    await ensureFirebaseReady();
    const { auth, googleProvider } = getFirebaseAuth();

    saveAuthRedirect(redirectPath);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      sessionStorage.removeItem("pg_google_pending");
      return await syncFirebaseUser(result.user);
    } catch (error) {
      if (!POPUP_FALLBACK_CODES.has(error?.code)) {
        throw error;
      }

      sessionStorage.setItem("pg_google_pending", "1");
      await signInWithRedirect(auth, googleProvider);
      return { redirected: true };
    }
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
