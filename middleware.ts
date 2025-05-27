import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminSession = request.cookies.get('admin_session');

  // If trying to access admin page and not logged in
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If trying to access login page while logged in
  if (request.nextUrl.pathname === '/login') {
    if (adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}; 