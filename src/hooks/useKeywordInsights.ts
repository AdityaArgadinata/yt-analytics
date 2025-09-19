import { useState, useEffect, useCallback } from 'react';
import { KeywordInsights } from '@/lib/keywords';

interface CacheEntry {
  data: KeywordInsights;
  timestamp: number;
  channelId: string;
}

/**
 * Custom hook for managing Keyword Insights with minimal caching for compliance
 * 
 * Features:
 * - Short-term session caching (2 minutes max) to avoid excessive API calls
 * - Automatic cache expiration and cleanup
 * - Force refresh capability
 * - Minimal data retention for YouTube API compliance
 * 
 * @param channelId - YouTube channel ID to fetch insights for
 * @returns Object with insights data, loading state, error handling, and cache management functions
 */

// Cache duration: 2 minutes (reduced for compliance)
const CACHE_DURATION = 2 * 60 * 1000;

// In-memory cache for the session
const cache = new Map<string, CacheEntry>();

// Cleanup expired cache entries
const cleanupExpiredCache = () => {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if ((now - entry.timestamp) >= CACHE_DURATION) {
      cache.delete(key);
      console.log('Expired cache entry removed:', key);
    }
  }
};

// Run cleanup every minute
setInterval(cleanupExpiredCache, 60 * 1000);

export function useKeywordInsights(channelId: string) {
  const [insights, setInsights] = useState<KeywordInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchType, setLastFetchType] = useState<'cache' | 'api' | null>(null);

  const fetchInsights = useCallback(async (forceRefresh = false) => {
    if (!channelId) return;

    // Check cache first
    const cacheKey = `insights-${channelId}`;
    const cachedEntry = cache.get(cacheKey);
    const now = Date.now();

    // Use cached data if it exists and is still fresh, unless force refresh is requested
    if (!forceRefresh && cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
      console.log('Using cached keyword insights for channel:', channelId);
      setInsights(cachedEntry.data);
      setError(null);
      setLastFetchType('cache');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching fresh keyword insights for channel:', channelId);
      
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelId,
          maxResults: 50
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Gagal menganalisis kata kunci');
      }

      const data = await response.json();
      console.log('Received fresh insights data:', data);
      
      // Cache the fresh data
      cache.set(cacheKey, {
        data,
        timestamp: now,
        channelId
      });
      
      setInsights(data);
      setLastFetchType('api');
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal');
      
      // Fallback to demo data if there's an error
      console.log('Loading demo data as fallback...');
      try {
        const demoResponse = await fetch('/api/keywords?demo=true');
        if (demoResponse.ok) {
          const demoData = await demoResponse.json();
          setInsights(demoData);
          setError(null);
        }
      } catch (demoErr) {
        console.error('Demo data fallback failed:', demoErr);
      }
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  // Load insights when channelId changes
  useEffect(() => {
    if (channelId) {
      fetchInsights();
    }
  }, [channelId, fetchInsights]);

  // Return cache status for UI feedback
  const getCacheStatus = useCallback(() => {
    if (!channelId) return null;
    
    const cacheKey = `insights-${channelId}`;
    const cachedEntry = cache.get(cacheKey);
    
    if (!cachedEntry) return null;
    
    const now = Date.now();
    const age = now - cachedEntry.timestamp;
    const remainingTime = CACHE_DURATION - age;
    
    return {
      isCached: remainingTime > 0,
      ageInMinutes: Math.floor(age / (60 * 1000)),
      remainingMinutes: Math.floor(remainingTime / (60 * 1000)),
      isExpired: remainingTime <= 0
    };
  }, [channelId]);

  // Clear cache for specific channel
  const clearCache = useCallback(() => {
    if (!channelId) return;
    
    const cacheKey = `insights-${channelId}`;
    cache.delete(cacheKey);
    console.log('Cache cleared for channel:', channelId);
  }, [channelId]);

  // Clear all cache
  const clearAllCache = useCallback(() => {
    cache.clear();
    console.log('All cache cleared');
  }, []);

  return {
    insights,
    loading,
    error,
    lastFetchType,
    fetchInsights,
    refreshInsights: () => fetchInsights(true),
    getCacheStatus,
    clearCache,
    clearAllCache
  };
}