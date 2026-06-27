"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut } from "firebase/auth";
import axiosInstance from "@/lib/axiosInstance";
import { getFirebaseAuth } from "@/lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncFirebaseUser = useCallback(async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();

    const { data } = await axiosInstance.post("/auth/google-sync", {
      idToken,
      name: firebaseUser.displayName || "User",
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || "",
    });

    setUser(data.data);
    return data;
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("/auth/me");
      setUser(data.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    let unsubscribe = null;

    try {
      const { auth } = getFirebaseAuth();

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          return;
        }

        try {
          await syncFirebaseUser(firebaseUser);
        } catch (error) {
          console.error("[auth] Failed to sync Firebase user", error);
        } finally {
          setLoading(false);
        }
      });
    } catch {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [syncFirebaseUser]);

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
