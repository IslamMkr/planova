'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthContextProps {
  user: SupabaseUser | null;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
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

  const value = React.useMemo(
    () => ({ user, isAuthenticated: !!user }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
