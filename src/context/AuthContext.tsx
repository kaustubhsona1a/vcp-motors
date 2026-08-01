import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginAsDealer: (email?: string) => void;
  loginWithGoogle?: () => Promise<void>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginAsDealer: () => {},
  logout: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('vcp_dealer_authenticated') === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const localAuth = localStorage.getItem('vcp_dealer_authenticated') === 'true';

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(localAuth);
      }
      setLoading(false);
    }).catch(() => {
      if (!isMounted) return;
      setIsAdmin(localAuth);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(localStorage.getItem('vcp_dealer_authenticated') === 'true');
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAsDealer = (email?: string) => {
    localStorage.setItem('vcp_dealer_authenticated', 'true');
    if (email) {
      localStorage.setItem('vcp_dealer_email', email);
    }
    setIsAdmin(true);
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('vcp_dealer_authenticated');
    localStorage.removeItem('vcp_dealer_email');
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      loginAsDealer, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

