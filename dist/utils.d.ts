import { Artifact } from "./types";
export declare function saveJson(location: string, file: string, json: object): void;
export declare function loadJson(location: string, file: string): any;
export declare function checkFile(location: string, file: string): boolean;
export declare function removeFile(location: string, file: string): void;
export declare function removeDir(location: string, dir: string): void;
export declare function shell(command: string, cwd: string): Promise<void>;
export declare function availableVersions(artifact: Artifact, require?: string): string[];
export declare function shaHexToBase64(hex: string): string;
