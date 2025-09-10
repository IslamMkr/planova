import { redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export const revalidate = 0;

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
