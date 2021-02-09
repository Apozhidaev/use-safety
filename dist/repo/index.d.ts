import { Artifact } from "../types";
import { Fiber } from "./cache/fiber";
export declare function getArtifact(name: string): Promise<Artifact | undefined>;
export declare function canIUse(name: string, range: string, fiber?: Fiber): Promise<boolean>;
export declare function safetyPackage(name?: string): Promise<string | undefined>;
