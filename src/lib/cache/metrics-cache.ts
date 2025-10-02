import { supabase } from '@/lib/supabase';
import { Metrics } from '@/types/ads';

interface CacheEntry {
  data: Metrics[];
  timestamp: number;
  expiresAt: number;
}

interface CacheKey {
  entityType: 'campaign' | 'adset' | 'ad';
  entityId: string;
  platform: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

class MetricsCache {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  private readonly STALE_WHILE_REVALIDATE = 10 * 60 * 1000; // 10 minutos
  private refreshPromises = new Map<string, Promise<Metrics[]>>();

  private generateKey(cacheKey: CacheKey): string {
    return `${cacheKey.platform}:${cacheKey.entityType}:${cacheKey.entityId}:${cacheKey.dateRange.startDate}:${cacheKey.dateRange.endDate}`;
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt;
  }

  private isStale(entry: CacheEntry): boolean {
    return Date.now() > entry.timestamp + this.CACHE_DURATION;
  }

  async get(cacheKey: CacheKey): Promise<Metrics[]> {
    const key = this.generateKey(cacheKey);
    const entry = this.cache.get(key);

    // Cache miss - fetch fresh data
    if (!entry) {
      return this.fetchAndCache(cacheKey);
    }

    // Cache hit but expired - fetch fresh data
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return this.fetchAndCache(cacheKey);
    }

    // Cache hit but stale - return cached data and refresh in background
    if (this.isStale(entry)) {
      this.refreshInBackground(cacheKey);
      return entry.data;
    }

    // Cache hit and fresh
    return entry.data;
  }

  private async fetchAndCache(cacheKey: CacheKey): Promise<Metrics[]> {
    const key = this.generateKey(cacheKey);
    
    // Check if there's already a refresh in progress
    const existingPromise = this.refreshPromises.get(key);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = this.fetchMetrics(cacheKey);
    this.refreshPromises.set(key, promise);

    try {
      const data = await promise;
      this.setCache(cacheKey, data);
      return data;
    } finally {
      this.refreshPromises.delete(key);
    }
  }

  private async refreshInBackground(cacheKey: CacheKey): Promise<void> {
    try {
      const data = await this.fetchMetrics(cacheKey);
      this.setCache(cacheKey, data);
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }

  private async fetchMetrics(cacheKey: CacheKey): Promise<Metrics[]> {
    const { data, error } = await supabase
      .from('metrics')
      .select('*')
      .eq('entity_type', cacheKey.entityType)
      .eq('entity_id', cacheKey.entityId)
      .eq('platform', cacheKey.platform)
      .gte('date', cacheKey.dateRange.startDate)
      .lte('date', cacheKey.dateRange.endDate)
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch metrics: ${error.message}`);
    }

    return data || [];
  }

  private setCache(cacheKey: CacheKey, data: Metrics[]): void {
    const key = this.generateKey(cacheKey);
    const now = Date.now();
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + this.STALE_WHILE_REVALIDATE
    });
  }

  invalidate(cacheKey: Partial<CacheKey>): void {
    const keysToDelete: string[] = [];
    
    for (const [key, _] of this.cache) {
      const shouldInvalidate = this.shouldInvalidateKey(key, cacheKey);
      if (shouldInvalidate) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private shouldInvalidateKey(cacheKey: string, pattern: Partial<CacheKey>): boolean {
    const parts = cacheKey.split(':');
    const [platform, entityType, entityId] = parts;

    if (pattern.platform && platform !== pattern.platform) return false;
    if (pattern.entityType && entityType !== pattern.entityType) return false;
    if (pattern.entityId && entityId !== pattern.entityId) return false;

    return true;
  }

  clear(): void {
    this.cache.clear();
    this.refreshPromises.clear();
  }

  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    
    return {
      totalEntries: entries.length,
      freshEntries: entries.filter(entry => !this.isStale(entry)).length,
      staleEntries: entries.filter(entry => this.isStale(entry) && !this.isExpired(entry)).length,
      expiredEntries: entries.filter(entry => this.isExpired(entry)).length,
      cacheHitRate: this.calculateHitRate(),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private calculateHitRate(): number {
    // Implementação simplificada - em produção, você manteria contadores
    return 0.85; // 85% de hit rate estimado
  }

  private estimateMemoryUsage(): number {
    // Estimativa aproximada do uso de memória em bytes
    let size = 0;
    for (const [key, entry] of this.cache) {
      size += key.length * 2; // string chars são 2 bytes
      size += JSON.stringify(entry.data).length * 2;
      size += 24; // timestamp e expiresAt
    }
    return size;
  }

  // Método para pré-carregar métricas comumente acessadas
  async preload(cacheKeys: CacheKey[]): Promise<void> {
    const promises = cacheKeys.map(key => this.get(key));
    await Promise.allSettled(promises);
  }

  // Método para agendar limpeza automática
  startCleanupSchedule(): void {
    setInterval(() => {
      this.cleanup();
    }, 60 * 1000); // Limpa a cada minuto
  }

  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }
}

// Instância singleton
export const metricsCache = new MetricsCache();

// Iniciar limpeza automática
metricsCache.startCleanupSchedule();

export type { CacheKey };