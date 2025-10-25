"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowDemo?: boolean;
}

export default function ProtectedRoute({ children, allowDemo = false }: ProtectedRouteProps) {
  const { user, loading, isDemoMode } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user && !isDemoMode) {
        router.push('/auth/login');
      } else if (!user && isDemoMode && !allowDemo) {
        router.push('/auth/login');
      }
    }
  }, [user, loading, isDemoMode, allowDemo, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return null;
  }

  if (!user && isDemoMode && !allowDemo) {
    return null;
  }

  return <>{children}</>;
}
