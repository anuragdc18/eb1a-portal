import { createContext, useContext, useState, ReactNode } from "react";
import type { Role } from "./mock-data";

export type AppRole = Role | "admin";

export interface AuthUser {
  id: string;
  role: AppRole;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Hardcoded demo accounts ─────────────────────────────────
// Role is determined by the account, not chosen at login.
export const DEMO_ACCOUNTS: Record<string, AuthUser> = {
  "super@epros.com": {
    id: "u1",
    role: "superadmin",
    name: "Alex Rivera",
    email: "super@epros.com",
    avatar: "AR",
  },
  "admin@epros.com": {
    id: "u2",
    role: "admin",
    name: "Priya Sharma",
    email: "admin@epros.com",
    avatar: "PS",
  },
  "admin2@epros.com": {
    id: "u3",
    role: "admin",
    name: "Rahul Verma",
    email: "admin2@epros.com",
    avatar: "RV",
  },
  "client@epros.com": {
    id: "u4",
    role: "client",
    name: "Dr. Arjun Mehta",
    email: "client@epros.com",
    avatar: "AM",
  },
  "team@epros.com": {
    id: "u5",
    role: "team",
    name: "Sarah Chen",
    email: "team@epros.com",
    avatar: "SC",
  },
  "consultant@epros.com": {
    id: "u6",
    role: "consultant",
    name: "Dr. James Liu",
    email: "consultant@epros.com",
    avatar: "JL",
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = DEMO_ACCOUNTS[normalizedEmail];
    if (!account) {
      return { success: false, error: "No account found with this email." };
    }
    if (!password || password.length < 1) {
      return { success: false, error: "Please enter a password." };
    }
    setUser(account);
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
