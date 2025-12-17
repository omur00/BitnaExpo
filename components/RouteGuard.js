import { useAuth } from '@/context/auth-context';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import Loading from './Loading';

// Define routes that are NOT allowed for authenticated users (regardless of role)
const DISALLOWED_FOR_AUTHENTICATED = [
  '(stacks)/register', // Registration page
  '(stacks)/forgot-password', // Forgot password page
  '(stacks)/forgot-password', // Forgot password in stacks
];

// Define role-based route restrictions
const ROLE_BASED_RESTRICTIONS = {
  USER: [
    '(admin)', // All admin routes
  ],
  MERCHANT: [
    '(admin)', // All admin routes
  ],
  TRAINER: [
    '(admin)', // All admin routes
  ],
  ADMIN: [
    // Admin can access everything, so empty array
  ],
};

// Define public routes (accessible without authentication)
const PUBLIC_ROUTES = [
  '(stacks)', // All stack routes
  '(stacks)/login', // Login in stacks
  '(stacks)/register', // Register in stacks
  'index', // Home page
  '(auth)',
];

// Define default routes for each role after login
const DEFAULT_ROUTES = {
  ADMIN: '/(admin)/dashboard',
  MERCHANT: '/(auth)/dashboard',
  TRAINER: '/(auth)/dashboard',
  USER: '/(auth)/dashboard',
};

export default function RouteGuard({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !rootNavigationState?.key) {
      return;
    }

    const currentPath = segments.join('/');
    const userRole = user?.role?.toUpperCase() || 'USER';

    console.log('🔍 RouteGuard Debug:');
    console.log('Segments:', segments);
    console.log('Current Path:', currentPath);
    console.log('Is Authenticated:', isAuthenticated);
    console.log('User Role:', userRole);
    console.log('User:', user);

    // 1. Handle authenticated users
    if (isAuthenticated) {
      // Check if current route is disallowed for all authenticated users
      const isDisallowedForAuthenticated = DISALLOWED_FOR_AUTHENTICATED.some((route) =>
        currentPath.includes(route.replace(/\//g, ''))
      );

      if (isDisallowedForAuthenticated) {
        console.log(
          '❌ Disallowed for authenticated user, redirecting to:',
          DEFAULT_ROUTES[userRole]
        );
        router.replace(DEFAULT_ROUTES[userRole]);
        return;
      }

      // Check role-based restrictions
      const roleRestrictions = ROLE_BASED_RESTRICTIONS[userRole] || [];
      const isDisallowedForRole = roleRestrictions.some((route) => {
        const routeWithoutSlashes = route.replace(/\//g, '');
        return currentPath.includes(routeWithoutSlashes);
      });

      if (isDisallowedForRole) {
        console.log(
          '❌ Disallowed for role:',
          userRole,
          'redirecting to:',
          DEFAULT_ROUTES[userRole]
        );
        router.replace(DEFAULT_ROUTES[userRole]);
      }
    }
    // 2. Handle unauthenticated users
    else {
      // Check if current route requires authentication
      const isPublicRoute = PUBLIC_ROUTES.some((route) => {
        const routeWithoutSlashes = route.replace(/\//g, '');
        return currentPath.includes(routeWithoutSlashes);
      });

      if (!isPublicRoute && segments.length > 0) {
        console.log('❌ Not authenticated for protected route, redirecting to login');
        router.replace('/(auth)');
      }
    }
  }, [isAuthenticated, loading, segments, rootNavigationState, user?.role]);

  if (loading) {
    return <Loading />;
  }

  return <>{children}</>;
}
