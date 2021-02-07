import { Artifact } from "../../types";
declare type Value = Promise<Artifact | undefined>;
export declare const cache: Record<string, Value>;
export declare function add(name: string, value: Value): void;
export declare function has(name: string): boolean;
export declare function get(name: string): Value;
export {};
