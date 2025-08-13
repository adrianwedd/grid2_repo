// lib/session-storage.ts
import { HistoryManager } from '@/lib/transforms';
import type { SectionNode } from '@/types/section-system';

export interface SessionData {
  id: string;
  history: {
    past: SectionNode[][];
    present: SectionNode[];
    future: SectionNode[][];
  };
  updatedAt: number;
  createdAt: number;
}

export interface SessionStorage {
  get(id: string): Promise<SessionData | null>;
  set(id: string, data: SessionData): Promise<void>;
  delete(id: string): Promise<void>;
  cleanup(): Promise<void>;
}

// In-memory fallback implementation
class MemorySessionStorage implements SessionStorage {
  private sessions = new Map<string, SessionData>();
  private readonly TTL_MS = 30 * 60 * 1000; // 30 minutes

  async get(id: string): Promise<SessionData | null> {
    const session = this.sessions.get(id);
    if (!session) return null;

    // Check TTL
    if (Date.now() - session.updatedAt > this.TTL_MS) {
      this.sessions.delete(id);
      return null;
    }

    return session;
  }

  async set(id: string, data: SessionData): Promise<void> {
    this.sessions.set(id, { ...data, updatedAt: Date.now() });
  }

  async delete(id: string): Promise<void> {
    this.sessions.delete(id);
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [id, session] of this.sessions.entries()) {
      if (now - session.updatedAt > this.TTL_MS) {
        this.sessions.delete(id);
      }
    }
  }
}

// Redis implementation using ioredis
class RedisSessionStorage implements SessionStorage {
  private redis: any = null;
  private readonly TTL_SECONDS = 30 * 60; // 30 minutes

  constructor() {
    this.initRedis();
  }

  private async initRedis() {
    try {
      const Redis = (await import('ioredis')).default;
      
      // Try Redis connection (local or environment)
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.redis = new Redis(redisUrl, {
        enableReadyCheck: false,
        maxRetriesPerRequest: 1,
        lazyConnect: true
      });

      // Test connection
      await this.redis.ping();
      console.log('Redis connected successfully');
    } catch (error) {
      console.warn('Redis connection failed, using memory storage:', error);
      this.redis = null;
    }
  }

  private getKey(id: string): string {
    return `session:${id}`;
  }

  async get(id: string): Promise<SessionData | null> {
    if (!this.redis) return null;

    try {
      const data = await this.redis.get(this.getKey(id));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(id: string, data: SessionData): Promise<void> {
    if (!this.redis) return;

    try {
      const key = this.getKey(id);
      const value = JSON.stringify({ ...data, updatedAt: Date.now() });
      await this.redis.setex(key, this.TTL_SECONDS, value);
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(id: string): Promise<void> {
    if (!this.redis) return;

    try {
      await this.redis.del(this.getKey(id));
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async cleanup(): Promise<void> {
    // Redis handles TTL automatically, no manual cleanup needed
  }
}

// Vercel KV implementation
class VercelKVStorage implements SessionStorage {
  private kv: any = null;
  private readonly TTL_SECONDS = 30 * 60; // 30 minutes

  constructor() {
    this.initKV();
  }

  private async initKV() {
    try {
      if (process.env.KV_URL) {
        const { kv } = await import('@vercel/kv');
        this.kv = kv;
        console.log('Vercel KV connected successfully');
      }
    } catch (error) {
      console.warn('Vercel KV connection failed:', error);
      this.kv = null;
    }
  }

  private getKey(id: string): string {
    return `session:${id}`;
  }

  async get(id: string): Promise<SessionData | null> {
    if (!this.kv) return null;

    try {
      const data = await this.kv.get(this.getKey(id));
      return data || null;
    } catch (error) {
      console.error('KV get error:', error);
      return null;
    }
  }

  async set(id: string, data: SessionData): Promise<void> {
    if (!this.kv) return;

    try {
      const key = this.getKey(id);
      const value = { ...data, updatedAt: Date.now() };
      await this.kv.setex(key, this.TTL_SECONDS, value);
    } catch (error) {
      console.error('KV set error:', error);
    }
  }

  async delete(id: string): Promise<void> {
    if (!this.kv) return;

    try {
      await this.kv.del(this.getKey(id));
    } catch (error) {
      console.error('KV delete error:', error);
    }
  }

  async cleanup(): Promise<void> {
    // KV handles TTL automatically
  }
}

// Composite storage with fallbacks
class CompositeSessionStorage implements SessionStorage {
  private storages: SessionStorage[];
  private primary: SessionStorage;

  private initPromise: Promise<void>;

  constructor() {
    // Initialize all storage options
    const memory = new MemorySessionStorage();
    const redis = new RedisSessionStorage();
    const kv = new VercelKVStorage();

    // Priority order: Vercel KV > Redis > Memory
    this.storages = [kv, redis, memory];
    this.primary = memory; // Default fallback

    // Set primary to first working storage
    this.initPromise = this.determinePrimary();
  }

  private async determinePrimary() {
    for (const storage of this.storages) {
      try {
        // Test storage with a dummy operation
        await storage.set('test', {
          id: 'test',
          history: { past: [], present: [], future: [] },
          updatedAt: Date.now(),
          createdAt: Date.now()
        });
        await storage.delete('test');
        
        this.primary = storage;
        console.log(`Using storage: ${storage.constructor.name}`);
        break;
      } catch (error) {
        continue;
      }
    }
  }

  async get(id: string): Promise<SessionData | null> {
    await this.initPromise;
    return await this.primary.get(id);
  }

  async set(id: string, data: SessionData): Promise<void> {
    await this.initPromise;
    await this.primary.set(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.initPromise;
    await this.primary.delete(id);
  }

  async cleanup(): Promise<void> {
    await this.initPromise;
    await this.primary.cleanup();
  }
}

// Singleton storage instance
let storage: SessionStorage | null = null;

export function getSessionStorage(): SessionStorage {
  if (!storage) {
    // Temporarily use only memory storage for debugging
    storage = new MemorySessionStorage();
    console.log('Using storage: MemorySessionStorage (debug mode)');
  }
  return storage;
}

// Helper functions to convert between HistoryManager and storage format
export function serializeSession(id: string, history: HistoryManager): SessionData {
  const serialized = history.serialize();
  return {
    id,
    history: serialized,
    updatedAt: Date.now(),
    createdAt: Date.now()
  };
}

export function deserializeSession(data: SessionData): HistoryManager {
  return HistoryManager.fromSerialized(data.history);
}