export class Fiber {
  value: Map<string, Set<string>> = new Map();

  add(name: string, range: string) {
    if (!this.value.has(name)) this.value.set(name, new Set());
    this.value.get(name)!.add(range);
  }

  has(name: string, range: string): boolean {
    return this.value.has(name) && this.value.get(name)!.has(range);
  }
}
