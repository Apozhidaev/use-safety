import { Dependent, PackageMeta, Dependency } from "../types";
export default class BadPackage {
    readonly name: string;
    readonly version: string;
    readonly meta: PackageMeta;
    readonly dependents: Dependent[];
    log?: string;
    availableVersions?: string[];
    resolved?: boolean;
    constructor(name: string, version: string, meta: PackageMeta);
    replace(dependency: Dependency): void;
    remove(): void;
    asUnresolved(availableVersions: string[]): void;
    toJSON(): Record<string, any>;
}
