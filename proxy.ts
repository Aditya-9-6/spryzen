import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const PROTECTED_ROUTES = ['/portal'];

// Routes that auth'd users shouldn't visit (redirect to portal)
const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get JWT from httpOnly cookie set by our login API route
  const token = req.cookies.get('spryzen_token')?.value;

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r));

  // Not logged in + trying to access portal → redirect to login
  if (isProtected && !token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/auth/login';
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already logged in + visiting auth pages → redirect to portal
  if (isAuthRoute && token) {
    const portalUrl = req.nextUrl.clone();
    portalUrl.pathname = '/portal/dashboard';
    return NextResponse.redirect(portalUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/portal/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};
