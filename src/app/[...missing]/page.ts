import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export const dynamic = 'force-dynamic'; // ensure per-request auth check

const MissingPage = async ({ params }: { params: { missing?: string[] } }) => {
  const { missing } = await params;
  if (missing?.[0] === 'api') {
    notFound();
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    // Logged in → bounce to dashboard
    redirect('/dashboard');
  }

  // Guest → render the normal 404
  notFound();
};

export default MissingPage;
