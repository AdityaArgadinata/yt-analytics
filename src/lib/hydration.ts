import { useEffect, useState } from 'react';
import React from 'react';

/**
 * Custom hook to prevent hydration mismatches
 * Use this when you need to access browser-only APIs like localStorage, Date.now(), etc.
 */
export function useHydration() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Component wrapper to prevent hydration issues
 * Use this to wrap components that access browser-only APIs
 */
export function ClientOnly({ children }: { children: React.ReactNode }) {
  const mounted = useHydration();
  
  if (!mounted) {
    return null;
  }
  
  return React.createElement(React.Fragment, null, children);
}

/**
 * Safe localStorage access that won't cause hydration issues
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }
};

/**
 * Safe date formatting that won't cause hydration issues
 */
export function formatDateSafe(date: Date, locale = 'en-US'): string {
  if (typeof window === 'undefined') {
    // Return a consistent format for SSR
    return date.toISOString().split('T')[0];
  }
  
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}