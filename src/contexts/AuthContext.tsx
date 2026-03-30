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

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const profile = await authService.getUserProfile(uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUserProfile(null);
    }
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
        // Small delay to ensure profile is created first
        await new Promise(resolve => setTimeout(resolve, 500));
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
    // Wait for profile to be created then fetch
    await new Promise(resolve => setTimeout(resolve, 1000));
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
