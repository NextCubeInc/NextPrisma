import { useState, useEffect, useCallback, useRef } from 'react';
import { metricsCache, CacheKey } from '@/lib/cache/metrics-cache';
import { Metrics } from '@/types/ads';

interface UseMetricsCacheOptions {
  enabled?: boolean;
  refetchInterval?: number;
  staleTime?: number;
}

interface UseMetricsCacheResult {
  data: Metrics[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isStale: boolean;
  refetch: () => Promise<void>;
  invalidate: () => void;
}

export function useMetricsCache(
  cacheKey: CacheKey | null,
  options: UseMetricsCacheOptions = {}
): UseMetricsCacheResult {
  const {
    enabled = true,
    refetchInterval,
    staleTime = 5 * 60 * 1000 // 5 minutos
  } = options;

  const [data, setData] = useState<Metrics[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const refetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isStale = Date.now() - lastFetch > staleTime;

  const fetchData = useCallback(async () => {
    if (!cacheKey || !enabled) return;

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const result = await metricsCache.get(cacheKey);
      
      // Verificar se a requisição não foi cancelada
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
        setLastFetch(Date.now());
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const error = err instanceof Error ? err : new Error('Failed to fetch metrics');
        setIsError(true);
        setError(error);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [cacheKey, enabled]);

  const refetch = useCallback(async () => {
    if (cacheKey) {
      metricsCache.invalidate(cacheKey);
      await fetchData();
    }
  }, [cacheKey, fetchData]);

  const invalidate = useCallback(() => {
    if (cacheKey) {
      metricsCache.invalidate(cacheKey);
      setData(undefined);
      setLastFetch(0);
    }
  }, [cacheKey]);

  // Fetch inicial e quando cacheKey muda
  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Configurar refetch automático
  useEffect(() => {
    if (refetchInterval && enabled && cacheKey) {
      refetchIntervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current);
        }
      };
    }
  }, [refetchInterval, enabled, cacheKey, fetchData]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isLoading,
    isError,
    error,
    isStale,
    refetch,
    invalidate
  };
}

// Hook para múltiplas métricas
export function useMultipleMetricsCache(
  cacheKeys: (CacheKey | null)[],
  options: UseMetricsCacheOptions = {}
) {
  const results = cacheKeys.map(key => useMetricsCache(key, options));

  return {
    data: results.map(r => r.data),
    isLoading: results.some(r => r.isLoading),
    isError: results.some(r => r.isError),
    errors: results.map(r => r.error),
    isStale: results.some(r => r.isStale),
    refetchAll: async () => {
      await Promise.all(results.map(r => r.refetch()));
    },
    invalidateAll: () => {
      results.forEach(r => r.invalidate());
    }
  };
}

// Hook para estatísticas do cache
export function useMetricsCacheStats() {
  const [stats, setStats] = useState(metricsCache.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(metricsCache.getStats());
    }, 5000); // Atualiza a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return stats;
}

// Hook para pré-carregar métricas
export function useMetricsPreloader() {
  const preload = useCallback(async (cacheKeys: CacheKey[]) => {
    await metricsCache.preload(cacheKeys);
  }, []);

  const clearCache = useCallback(() => {
    metricsCache.clear();
  }, []);

  return {
    preload,
    clearCache
  };
}