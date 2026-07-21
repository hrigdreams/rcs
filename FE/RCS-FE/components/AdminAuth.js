'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        router.push('/authentication/Login');
        return;
      }
      // If user is regular user, redirect to user dashboard
      if (user?.data?.role === 'user') {
        router.push('/homepage');
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

  // Don't render anything if user is not authenticated or not an admin
  if (!user || user?.data?.role !== 'admin') {
    return null;
  }

  // User is authenticated and has admin role, render children
  return <>{children}</>;
}