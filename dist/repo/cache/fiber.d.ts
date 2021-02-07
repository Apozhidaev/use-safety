export declare class Fiber {
    value: Map<string, Set<string>>;
    add(name: string, range: string): void;
    has(name: string, range: string): boolean;
}
