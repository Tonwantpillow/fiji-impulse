"use client";

import { useSession } from '@/contexts/SessionContext';
import { ReactNode } from 'react';

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedContent({ children, fallback = null }: ProtectedContentProps) {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}