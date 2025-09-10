import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/services/supabase/server';

export const dynamic = 'force-dynamic'; // ensure per-request auth check

const MissingPage = async ({ params }: { params: { missing?: string[] } }) => {
  // If the unknown path is under /api, keep a real 404 (don’t redirect)
  if (params.missing?.[0] === 'api') {
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
