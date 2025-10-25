"use client";

import { useSession } from '@/contexts/SessionContext';

export function useRequireAuth() {
  const { user, isLoading, setShowLoginModal } = useSession();

  const requireAuth = (callback?: () => void) => {
    if (isLoading) return false;

    if (!user) {
      setShowLoginModal(true);
      return false;
    }

    if (callback) {
      callback();
    }
    return true;
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    requireAuth
  };
}