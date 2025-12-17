import { Redirect } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import Loading from '@/components/Loading';

export default function Index() {
  const { user, isAuthenticated, loading } = useAuth();

  // Show nothing while loading
  if (loading) {
    return <Loading/>;
  }

  if (isAuthenticated && user?.role !== 'admin') {
    return <Redirect href="/(auth)/dashboard" />;
  }

  if (isAuthenticated && user?.role === 'admin') {
    return <Redirect href="/(admin)" />;
  }

  // If not authenticated, redirect to the initial stack (default)
  // This will show your (stacks) layout's default screen
  return <Redirect href="/(stacks)" />;
}
