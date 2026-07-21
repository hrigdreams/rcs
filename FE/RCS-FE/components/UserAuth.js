'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UserAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/authentication/Login');
        return;
      }
      // If user is admin, redirect to admin dashboard
      if (user?.data?.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated or not a user
  if (!user || user?.data?.role !== 'user') {
    return null;
  }

  // User is authenticated and has user role, render children
  return <>{children}</>;
}