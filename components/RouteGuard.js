import { useAuth } from '@/context/auth-context';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useEffect } from 'react';
import Loading from './Loading';

// Define routes that are NOT allowed for authenticated users (regardless of role)
const DISALLOWED_FOR_AUTHENTICATED = ['(stacks)/register', '(stacks)/forgot-password'];

// Define role-based route restrictions
const ROLE_BASED_RESTRICTIONS = {
  USER: ['(admin)'],
  MERCHANT: ['(admin)'],
  TRAINER: ['(admin)'],
  ADMIN: [],
};

// Define public routes (accessible without authentication)
const PUBLIC_ROUTES = ['(stacks)', '(stacks)/login', '(stacks)/register', 'index', '(auth)'];

// Define default routes for each role after login
const DEFAULT_ROUTES = {
  ADMIN: '/(admin)/dashboard',
  MERCHANT: '/(auth)/dashboard',
  TRAINER: '/(auth)/dashboard',
  USER: '/(auth)/dashboard',
};

// Helper function to normalize paths for comparison
function normalizePath(path) {
  return path.replace(/\//g, '/').trim();
}

// Helper function to check if a route matches
function routeMatches(currentPath, targetRoute) {
  const normalizedCurrent = normalizePath(currentPath);
  const normalizedTarget = normalizePath(targetRoute);

  // Remove parentheses for comparison if needed
  return (
    normalizedCurrent.includes(normalizedTarget) ||
    normalizedCurrent.replace(/[()]/g, '') === normalizedTarget.replace(/[()]/g, '')
  );
}

export default function RouteGuard({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (loading || !rootNavigationState?.key) {
      return;
    }

    // Build current path from segments
    const currentPath = segments.length > 0 ? `/${segments.join('/')}` : '/';
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
        routeMatches(currentPath, route)
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
      const isDisallowedForRole = roleRestrictions.some((route) =>
        routeMatches(currentPath, route)
      );

      if (isDisallowedForRole) {
        console.log(
          '❌ Disallowed for role:',
          userRole,
          'redirecting to:',
          DEFAULT_ROUTES[userRole]
        );
        router.replace(DEFAULT_ROUTES[userRole]);
        return;
      }
    }
    // 2. Handle unauthenticated users
    else {
      // Check if current route requires authentication
      const isPublicRoute = PUBLIC_ROUTES.some((route) => routeMatches(currentPath, route));

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
