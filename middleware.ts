import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/secret-admin-voices')) {
    if (request.nextUrl.pathname === '/secret-admin-voices/login') {
        // If already logged in, redirect to dashboard
        const authCookie = request.cookies.get('admin_session');
        if (authCookie?.value === 'true') {
             return NextResponse.redirect(new URL('/secret-admin-voices', request.url));
        }
        return NextResponse.next();
    }
    
    const authCookie = request.cookies.get('admin_session');
    
    if (authCookie?.value !== 'true') {
      return NextResponse.redirect(new URL('/secret-admin-voices/login', request.url));
    }
  }
  
  return NextResponse.next();
}
