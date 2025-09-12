"use client";
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Image from 'next/image';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
    }
  };

  const handleSignOut = async () => {
    try {
      setError('');
      await signOut();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-gray-100 animate-pulse border border-gray-200 w-full sm:w-auto">
        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full"></div>
        <div className="w-16 sm:w-20 h-3 sm:h-4 bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (user) {
    // Check if user is admin
    const isAdmin = user.email === "aditdevelop@gmail.com";

    return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
        {/* User Info */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-sm min-w-0 flex-1 sm:flex-initial">
          {user.photoURL && (
            <Image 
              src={user.photoURL} 
              alt={user.displayName || 'User'} 
              width={28}
              height={28}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full ring-1 sm:ring-2 ring-emerald-400/50 flex-shrink-0"
            />
          )}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
              {user.displayName || 'User'}
            </span>
            <span className="text-xs text-gray-500 truncate hidden sm:block">
              {user.email}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {/* Admin Link */}
          {isAdmin && (
            <a
              href="/admin"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 hover:border-emerald-300 flex-1 sm:flex-initial text-center"
            >
              Admin
            </a>
          )}
          
          <button
            onClick={handleSignOut}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 flex-1 sm:flex-initial"
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full sm:w-auto font-apple">
      <button
        onClick={handleSignIn}
        className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl font-medium text-gray-900 shadow-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 backdrop-blur-sm text-sm sm:text-base w-full sm:w-auto"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="truncate">Masuk dengan Google</span>
      </button>
      {error && (
        <p className="text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</p>
      )}
    </div>
  );
}
