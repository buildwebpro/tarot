import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/firebase';
import type { UserProfile } from '../types/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName?: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const profileFetchedRef = useRef(false);

  const fetchProfile = useCallback(async (uid: string, retries = 4) => {
    for (let i = 0; i <= retries; i++) {
      try {
        const profile = await authService.getUserProfile(uid);
        if (profile) {
          setUserProfile(profile);
          return;
        }
      } catch (error) {
        console.error('Error fetching user profile (attempt ' + (i + 1) + '):', error);
      }
      // Exponential backoff: 300ms, 600ms, 1200ms ...
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, 300 * Math.pow(2, i)));
      }
    }
    setUserProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.uid);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // ใช้ retry แทน delay แบบสุ่ม (แก้ race condition การสร้างโปรไฟล์)
        await fetchProfile(firebaseUser.uid);
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const loggedInUser = await authService.login(email, password);
    return loggedInUser;
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const newUser = await authService.register(email, password, displayName);
    return newUser;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const loggedInUser = await authService.loginWithGoogle();
    // ใช้ retry logic ใน fetchProfile แทนการหน่วงเวลาแบบตายตัว
    await fetchProfile(loggedInUser.uid);
    return loggedInUser;
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserProfile(null);
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated: !!user,
    isPremium: userProfile?.isPremium ?? false,
    isAdmin: userProfile?.isAdmin ?? false,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
