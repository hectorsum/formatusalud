import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. Define Route Groups
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/book') || path.startsWith('/profile');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup');

  // 2. Get Session
  const sessionCookie = request.cookies.get('session')?.value;
  const session = await decrypt(sessionCookie);

  // 3. Logic: Redirect Logged-In Users away from Auth Routes
  if (isAuthRoute && session?.userId) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  // 4. Logic: Protect Routes
  if (isProtectedRoute) {
    // Case A: No session at all -> Redirect to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Case B: Session cookie exists but is invalid/expired -> Redirect with error
    if (!session?.userId) {
      // Create response to remove the invalid cookie
      const response = NextResponse.redirect(new URL('/login?error=SessionExpired', request.nextUrl));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
