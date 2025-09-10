import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PROTECTED_PREFIXES = ['/dashboard', '/profile', '/settings'];

export const middleware = async (req: NextRequest) => {
  const res = await updateSession(req);

  // Pre-redirect guests away from protected URLs
  const pathname = req.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  const hasAuth =
    req.cookies.get('sb-access-token') || req.cookies.get('sb:token');

  if (needsAuth && !hasAuth) {
    const url = new URL('/sign-in', req.url);
    url.searchParams.set('next', pathname + req.nextUrl.search);

    return NextResponse.redirect(url);
  }

  return res;
};

export const config = {
  matcher: [
    // run middleware where your app needs cookies/auth (and on protected prefixes)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
