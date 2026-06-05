import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import type { Role } from "./portal-data";

export type AppRole = Role | "admin";

export interface AuthUser {
  id: string;
  role: AppRole;
  name: string;
  email: string;
  avatar: string;
  active?: boolean;
}

export interface AuthAccount extends AuthUser {
  password: string;
}

interface AuthContextType {
  user: AuthUser | null;
  accounts: AuthAccount[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updatePassword: (currentPassword: string, newPassword: string) => { success: boolean; error?: string };
  updateAccount: (id: string, updates: Partial<AuthAccount>) => void;
  createAccount: (account: Omit<AuthAccount, "id" | "avatar" | "active"> & { active?: boolean }) => void;
}

const STORAGE_KEY = "epros_auth_accounts_v1";

const DEFAULT_ACCOUNTS: AuthAccount[] = [
  { id: "u1", role: "superadmin", name: "Alex Rivera", email: "super@epros.com", avatar: "AR", password: "demo1234", active: true },
  { id: "u2", role: "admin", name: "Priya Sharma", email: "admin@epros.com", avatar: "PS", password: "demo1234", active: true },
  { id: "u3", role: "admin", name: "Rahul Verma", email: "admin2@epros.com", avatar: "RV", password: "demo1234", active: true },
  { id: "u4", role: "client", name: "Dr. Arjun Mehta", email: "client@epros.com", avatar: "AM", password: "demo1234", active: true },
  { id: "u5", role: "team", name: "Sarah Chen", email: "team@epros.com", avatar: "SC", password: "demo1234", active: true },
  { id: "u6", role: "consultant", name: "Dr. James Liu", email: "consultant@epros.com", avatar: "JL", password: "demo1234", active: true },
];

export const DEFAULT_PORTAL_USERS: Record<string, AuthUser> = Object.fromEntries(
  DEFAULT_ACCOUNTS.map(({ password: _password, ...account }) => [account.email, account])
);

const AuthContext = createContext<AuthContextType | null>(null);

function initials(name: string) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";
}

function publicUser(account: AuthAccount): AuthUser {
  const { password: _password, ...user } = account;
  return user;
}

function readAccounts(): AuthAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw) as AuthAccount[];
    return parsed.length ? parsed : DEFAULT_ACCOUNTS;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AuthAccount[]>(readAccounts);
  const [user, setUser] = useState<AuthUser | null>(null);

  const saveAccounts = (next: AuthAccount[]) => {
    setAccounts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.find((item) => item.email.toLowerCase() === normalizedEmail);
    if (!account) return { success: false, error: "No account found with this email." };
    if (!account.active) return { success: false, error: "This account is inactive. Contact your super admin." };
    if (account.password !== password) return { success: false, error: "Incorrect password." };
    setUser(publicUser(account));
    return { success: true };
  };

  const logout = () => setUser(null);

  const updatePassword = (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "You are not signed in." };
    const account = accounts.find((item) => item.id === user.id);
    if (!account) return { success: false, error: "Account not found." };
    if (account.password !== currentPassword) return { success: false, error: "Current password is incorrect." };
    if (newPassword.length < 6) return { success: false, error: "Use at least 6 characters." };
    saveAccounts(accounts.map((item) => item.id === user.id ? { ...item, password: newPassword } : item));
    return { success: true };
  };

  const updateAccount = (id: string, updates: Partial<AuthAccount>) => {
    const next = accounts.map((item) => {
      if (item.id !== id) return item;
      const merged = { ...item, ...updates };
      return { ...merged, avatar: updates.name ? initials(updates.name) : merged.avatar };
    });
    saveAccounts(next);
    const updatedSelf = next.find((item) => item.id === user?.id);
    if (updatedSelf) setUser(publicUser(updatedSelf));
  };

  const createAccount = (account: Omit<AuthAccount, "id" | "avatar" | "active"> & { active?: boolean }) => {
    const newAccount: AuthAccount = {
      ...account,
      id: `u${Date.now()}`,
      avatar: initials(account.name),
      active: account.active ?? true,
    };
    saveAccounts([...accounts, newAccount]);
  };

  const value = useMemo(
    () => ({ user, accounts, login, logout, updatePassword, updateAccount, createAccount }),
    [user, accounts]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
