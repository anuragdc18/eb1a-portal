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
const LOGIN_ATTEMPTS_KEY = "epros_login_attempts_v1";
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

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

function readLoginAttempts(): Record<string, { count: number; lockedUntil: number }> {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function saveLoginAttempts(attempts: Record<string, { count: number; lockedUntil: number }>) {
  try {
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch {
    // Storage can be blocked in some embedded/private browsers; login should still render.
  }
}

function cleanEmail(email: string) {
  return email.trim().toLowerCase();
}

function cleanAccount(account: AuthAccount): AuthAccount {
  return {
    ...account,
    name: account.name.trim().slice(0, 80),
    email: cleanEmail(account.email),
    password: account.password.slice(0, 128),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AuthAccount[]>(readAccounts);
  const [user, setUser] = useState<AuthUser | null>(null);

  const saveAccounts = (next: AuthAccount[]) => {
    setAccounts(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep in-memory account edits working even when browser storage is unavailable.
    }
  };

  const login = (email: string, password: string) => {
    const normalizedEmail = cleanEmail(email);
    const attempts = readLoginAttempts();
    const attempt = attempts[normalizedEmail];
    if (attempt?.lockedUntil && attempt.lockedUntil > Date.now()) {
      return { success: false, error: "Too many failed attempts. Try again in a few minutes." };
    }

    const account = accounts.find((item) => item.email.toLowerCase() === normalizedEmail);
    const fail = (error: string) => {
      const nextCount = (attempt?.count ?? 0) + 1;
      attempts[normalizedEmail] = {
        count: nextCount,
        lockedUntil: nextCount >= MAX_LOGIN_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
      };
      saveLoginAttempts(attempts);
      return { success: false, error };
    };

    if (!account) return fail("No account found with this email.");
    if (!account.active) return fail("This account is inactive. Contact your super admin.");
    if (account.password !== password) return fail("Incorrect password.");
    delete attempts[normalizedEmail];
    saveLoginAttempts(attempts);
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
    saveAccounts(accounts.map((item) => item.id === user.id ? cleanAccount({ ...item, password: newPassword }) : item));
    return { success: true };
  };

  const updateAccount = (id: string, updates: Partial<AuthAccount>) => {
    const next = accounts.map((item) => {
      if (item.id !== id) return item;
      const merged = { ...item, ...updates };
      return cleanAccount({ ...merged, avatar: updates.name ? initials(updates.name) : merged.avatar });
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
    saveAccounts([...accounts, cleanAccount(newAccount)]);
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
