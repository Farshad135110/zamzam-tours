// Custom hook for fetching and caching tour packages
import { useState, useEffect, useCallback } from 'react';

interface Package {
  package_id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  category: string;
  image: string;
  itinerary: string;
  included: string;
  excluded: string;
}

// In-memory cache
let packagesCache: Package[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const usePackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPackages = useCallback(async (forceRefresh = false) => {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && packagesCache && (now - cacheTimestamp < CACHE_DURATION)) {
      setPackages(packagesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch('/api/packages', {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch packages: ${res.status}`);
      }

      const data = await res.json();
      
      // Update cache
      packagesCache = data;
      cacheTimestamp = now;
      
      setPackages(data);
    } catch (err: any) {
      console.error('Error fetching packages:', err);
      setError(err.message || 'Failed to load packages');
      
      // Fallback to cache if available
      if (packagesCache) {
        setPackages(packagesCache);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const refetch = useCallback(() => {
    return fetchPackages(true);
  }, [fetchPackages]);

  return { packages, loading, error, refetch };
};

// Clear cache function (useful for admin updates)
export const clearPackagesCache = () => {
  packagesCache = null;
  cacheTimestamp = 0;
};
