const cache = new Map<string, { expires: number; value: Promise<unknown> }>();
export function cached<T>(key: string, load: () => Promise<T>, ttl = 30000): Promise<T> {
  const existing = cache.get(key);
  if (existing && existing.expires > Date.now()) return existing.value as Promise<T>;
  const value = load().catch(error => { if (cache.get(key)?.value === value) cache.delete(key); throw error; });
  cache.set(key, {value, expires:Date.now()+ttl});
  return value;
}
export function invalidatePublicCache() { cache.clear(); }
