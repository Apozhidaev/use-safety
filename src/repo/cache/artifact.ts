import { Artifact } from "../../types";

type Value = Promise<Artifact | undefined>;
export const cache: Record<string, Value> = {};

export function add(name: string, value: Value) {
  cache[name] = value;
}

export function has(name: string): boolean {
  return name in cache;
}

export function get(name: string): Value {
  return cache[name];
}
