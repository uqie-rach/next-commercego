import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * Middleware to protect routes
 */
export default withAuth(
  // Middleware function to run before the request is processed
  async function middleware(req: NextRequestWithAuth) {
    const pathname = req.nextUrl?.pathname;

    // Route protection
    const isAuth = await getToken({ req })

    // console.log('[middleware] isAuth', isAuth)
    const isSigninPage = pathname === '/signin' || pathname.startsWith('/signin')
    const isSignUpPage = pathname === '/signup' || pathname.startsWith('/signup')

    const protectedRoutes = ['/dashboard', '/', '/welcome']
    const isAccessingProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route))

    /**
     * When accessing login page, redirect to dashboard
     */
    if (isSigninPage || isSignUpPage) {

      // When authenticated, redirect to dashboard
      if (isAuth)
        return NextResponse.redirect(new URL('/welcome', req.url))

      // When accessing protected routes and not authenticated,
      return NextResponse.next()
    }

    /**
     * When accessing protected routes and not authenticated,
     * redirect to login page
     */
    if (!isAuth && isAccessingProtectedRoute)
      return NextResponse.redirect(new URL('/signin', req.url))

    /**
     * When authenticated and accessing / route,
     * redirect to /dashboard
     */
    // if (isAuth && pathname === '/')
    //   return NextResponse.redirect(new URL('/dashboard', req.url))

    if (isAuth && pathname === '/')
      return NextResponse.redirect(new URL('/welcome', req.url))

  },
  {
    callbacks: {
      async authorized() {
        return true
      }
    }
  }
)

export const config = {
  matcher: ['/', '/signin', '/signup', '/dashboard/:path*', '/welcome']
}
