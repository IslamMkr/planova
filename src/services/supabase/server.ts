import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Server components can only READ cookies
        getAll() {
          return cookieStore.getAll();
        },
        // no setAll here (Server Components can’t write cookies)
      },
    },
  );
};
