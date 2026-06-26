"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { signInWithPopup } from "firebase/auth";
import axiosInstance from "@/lib/axiosInstance";
import { getFirebaseAuth } from "@/lib/firebase";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    setUser(null);
  };

  const googleLogin = async () => {
    const { auth, googleProvider } = getFirebaseAuth();
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const idToken = await firebaseUser.getIdToken();

    const { data } = await axiosInstance.post("/auth/google-sync", {
      idToken,
      name: firebaseUser.displayName || "User",
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL || "",
    });

    setUser(data.data);
    return data;
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
