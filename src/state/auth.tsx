import React, { createContext, useContext, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "../lib/storage";
import { Role, User } from "../types";
import { loadDB } from "./store";

type AuthState = {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  isRole: (r: Role) => boolean;
};

const AuthCtx = createContext<AuthState | null>(null);

const KEY = "inspection_ui_pack_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadJSON<User | null>(KEY, null));

  const login = (username: string) => {
    const db = loadDB();
    const u = db.users.find((x) => x.username === username && !x.disabled) || null;
    setUser(u);
    saveJSON(KEY, u);
  };

  const logout = () => {
    setUser(null);
    saveJSON(KEY, null);
  };

  const value = useMemo<AuthState>(
    () => ({
      user,
      login,
      logout,
      isRole: (r) => user?.role === r,
    }),
    [user]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
