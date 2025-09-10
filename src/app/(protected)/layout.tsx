import { redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export const revalidate = 0; // no caching for protected tree

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
};

export default ProtectedLayout;
