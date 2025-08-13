'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, logoutUser } from '@/lib/api/auth';
import { supabase } from '@/lib/supabase';
import type { User, CounselorWithProfile } from '@/types/database';

interface AuthContextType {
  user: User | CounselorWithProfile | null;
  loading: boolean;
  login: (userData: User | CounselorWithProfile) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isCounselor: boolean;
  isVisitor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | CounselorWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data!);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data!);
          } else {
            setUser(null);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          const result = await getCurrentUser();
          if (result.success) {
            setUser(result.data!);
          }
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = (userData: User | CounselorWithProfile) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUser();
      if (result.success) {
        setUser(result.data!);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Refresh user error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user,
    isCounselor: user?.role === 'counselor',
    isVisitor: user?.role === 'visitor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useCounselorProfile() {
  const { user, isCounselor } = useAuth();
  
  if (!isCounselor || !user) {
    return null;
  }
  
  const counselorUser = user as CounselorWithProfile;
  return counselorUser.counselor_profiles;
} 