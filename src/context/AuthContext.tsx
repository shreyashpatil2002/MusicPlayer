import React, { createContext, useContext, useMemo, useState } from 'react';
import { UserProfile } from '../types';

interface AuthContextValue {
  isAuthenticated: boolean;
  profile: UserProfile | null;
  signInAsGuest: (displayName: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(profile),
      profile,
      signInAsGuest: (displayName: string) => {
        const cleanName = displayName.trim() || 'Listener';
        setProfile({ id: 'guest-user', displayName: cleanName });
      },
      signOut: () => setProfile(null),
    }),
    [profile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
