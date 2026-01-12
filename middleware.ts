import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define route groups
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/book') || path.startsWith('/admin');
  const isAuthRoute = path === '/login' || path === '/signup';
  const isAdminRoute = path.startsWith('/admin');

  // get session from cookie
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // 1. Unauthenticated users trying to access protected routes
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 2. Authenticated users trying to access auth routes (login/signup)
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // 3. Role-Based Access Control
  if (isAdminRoute && session?.userId) {
    // If not admin or doctor
    if (session.role !== 'ADMIN' && session.role !== 'DOCTOR') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
