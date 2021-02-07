type Value = Promise<boolean>;

export const cache: Record<string, Record<string, Value>> = {};

export function add(name: string, range: string, value: Value) {
  if (!cache[name]) cache[name] = {};
  cache[name][range] = value;
}

export function has(name: string, range: string): boolean {
  return cache[name] && range in cache[name];
}

export function get(name: string, range: string): Value {
  return cache[name][range];
}
