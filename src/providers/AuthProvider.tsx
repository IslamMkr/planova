'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/services/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { toast } from 'react-toastify';

export interface AuthContextProps {
  user: SupabaseUser | null;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  signOut: async () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({
  initialUser,
  children,
}: {
  initialUser: SupabaseUser | null;
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<SupabaseUser | null>(initialUser);
  const router = useRouter();
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // re-run server components → new initialUser
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  // When server re-hydrates with a new user, update local state
  React.useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut(); // clears session (cookies/local)
      router.replace('/sign-in'); // bounce to auth
      toast.success('Signed out successfully');
    } catch (e) {
      toast.error('Failed to sign out');
    }
  };

  const value = React.useMemo(() => ({ user, signOut }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
