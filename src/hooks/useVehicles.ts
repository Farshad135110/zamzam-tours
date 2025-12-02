// Custom hook for fetching and caching vehicles
import { useState, useEffect, useCallback } from 'react';

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  available_for: string;
  capacity: number;
  transmission: string;
  fuel: string;
  price_per_day: string;
  image: string;
  description: string;
}

// In-memory cache
let vehiclesCache: Vehicle[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async (forceRefresh = false) => {
    // Check cache first
    const now = Date.now();
    if (!forceRefresh && vehiclesCache && (now - cacheTimestamp < CACHE_DURATION)) {
      setVehicles(vehiclesCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const res = await fetch('/api/vehicles', {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch vehicles: ${res.status}`);
      }

      const data = await res.json();
      
      // Update cache
      vehiclesCache = data;
      cacheTimestamp = now;
      
      setVehicles(data);
    } catch (err: any) {
      console.error('Error fetching vehicles:', err);
      setError(err.message || 'Failed to load vehicles');
      
      // Fallback to cache if available
      if (vehiclesCache) {
        setVehicles(vehiclesCache);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const refetch = useCallback(() => {
    return fetchVehicles(true);
  }, [fetchVehicles]);

  return { vehicles, loading, error, refetch };
};

// Clear cache function (useful for admin updates)
export const clearVehiclesCache = () => {
  vehiclesCache = null;
  cacheTimestamp = 0;
};
