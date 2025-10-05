'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup'];

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useStore();

  useEffect(() => {
    // Allow public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated || !user) {
      router.push('/login');
    }
  }, [isAuthenticated, user, pathname, router]);

  // Show nothing while checking auth on protected routes
  if (!PUBLIC_ROUTES.includes(pathname) && (!isAuthenticated || !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
