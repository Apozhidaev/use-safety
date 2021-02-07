export declare type DependencyMap = Record<string, Dependency>;
export declare type Dependency = {
    version: string;
    resolved: string;
    integrity: string;
    requires?: Record<string, string>;
    dependencies?: DependencyMap;
};
export declare type PackageJson = {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
};
export declare type PackageLock = {
    lockfileVersion?: number;
    dependencies?: DependencyMap;
};
export declare type PackageParent = {
    name: string;
    version: string;
    meta: PackageMeta;
};
export declare type Dependent = {
    name: string;
    version: string;
    require: string;
};
export declare type PackageMeta = {
    parent?: PackageParent;
    packages: string[];
    dependencies: DependencyMap;
};
export declare type PackageInfo = {
    name: string;
    dependencies: Record<string, string>;
    dist: {
        shasum: string;
        tarball: string;
    };
    version: string;
};
export declare type Artifact = {
    name: string;
    "dist-tags": {
        latest: string;
    };
    versions: Record<string, PackageInfo>;
};
