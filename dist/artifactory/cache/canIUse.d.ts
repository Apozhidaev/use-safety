declare type Value = Promise<boolean>;
export declare const cache: Record<string, Record<string, Value>>;
export declare function add(name: string, range: string, value: Value): void;
export declare function has(name: string, range: string): boolean;
export declare function get(name: string, range: string): Value;
export {};
