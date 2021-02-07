export type DependencyMap = Record<string, Dependency>;

export type Dependency = {
  version: string;
  resolved: string;
  integrity: string;
  requires?: Record<string, string>;
  dependencies?: DependencyMap;
};

export type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export type PackageLock = {
  lockfileVersion?: number;
  dependencies?: DependencyMap;
};

export type PackageParent = {
  name: string;
  version: string;
  meta: PackageMeta;
};

export type Dependent = {
  name: string;
  version: string;
  require: string;
};

export type PackageMeta = {
  parent?: PackageParent;
  packages: string[];
  dependencies: DependencyMap;
};

export type PackageInfo = {
  name: string;
  dependencies: Record<string, string>;
  dist: {
    shasum: string;
    tarball: string;
  };
  version: string;
};

export type Artifact = {
  name: string;
  "dist-tags": { latest: string };
  versions: Record<string, PackageInfo>;
};
