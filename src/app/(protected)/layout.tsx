import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0; // no caching for protected tree

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    // middleware will attach ?next, so a plain redirect is fine
    redirect('/sign-in');
  }

  return <>{children}</>;
};

export default ProtectedLayout;
