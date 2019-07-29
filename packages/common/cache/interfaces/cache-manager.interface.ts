export interface LiteralObject {
  [key: string]: any;
}

export interface CacheStore {
  set<T>(key: string, value: T): Promise<void> | void;
  get<T>(key: string): Promise<void> | void;
  del(key: string): void | Promise<void>;
}

export interface CacheStoreFactory {
  create(args: LiteralObject): CacheStore;
}

/**
 * Interface defining Cache Manager configuration options
 *
 * @publicApi
 */
export interface CacheManagerOptions {
  /**
   * store
   */
  store?: string | CacheStoreFactory;
  /**
   * TTL
   */
  ttl?: number;
  /**
   * Max
   */
  max?: number;
  /**
   * Whether value is cacheable
   *
   * @param value is this cacheable
   */
  isCacheableValue?: (value: any) => boolean;
}
