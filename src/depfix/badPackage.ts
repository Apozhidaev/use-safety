import { Dependent, PackageParent, PackageMeta, Dependency } from "../types";

function parentToJSON(parent: PackageParent): Record<string, any> {
  const json = {
    name: parent.name,
    version: parent.version,
    dependencies: {},
  };
  if (parent.meta.parent) {
    const parentJson = parentToJSON(parent.meta.parent);
    parentJson.dependencies[json.name] = json;
    return parentJson;
  }
  return json;
}

function getDependents(name: string, meta: PackageMeta) {
  const { packages, dependencies } = meta;
  const dependents = packages
    .filter((x) => x !== name)
    .reduce((acc: Dependent[], pkg: string) => {
      const dependency = dependencies[pkg];
      if (dependency?.requires?.[name] && !dependency.dependencies?.[name]) {
        acc.push({
          name: pkg,
          version: dependency.version,
          require: dependency.requires[name],
        });
      }
      return acc;
    }, [] as Dependent[]);
  return dependents;
}

export default class BadPackage {
  readonly dependents: Dependent[];
  log?: string;
  availableVersions?: string[];
  resolved?: boolean;

  constructor(readonly name: string, readonly version: string, readonly meta: PackageMeta) {
    this.dependents = getDependents(name, meta);
  }

  replace(dependency: Dependency) {
    this.meta.dependencies[this.name] = dependency;
    this.resolved = true;
    this.log = `Replaced -> ${dependency.version}`;
  }

  remove() {
    delete this.meta.dependencies[this.name];
    this.resolved = true;
    this.log = "Removed";
  }

  asUnresolved(availableVersions: string[]) {
    this.resolved = false;
    this.log = "Try install another version";
    this.availableVersions = availableVersions;
  }

  toJSON() {
    const json = {
      name: this.name,
      version: this.version,
      log: this.log,
      availableVersions: this.availableVersions,
    };
    if (this.meta.parent) {
      const parentJson = parentToJSON(this.meta.parent);
      parentJson.dependencies[json.name] = json;
      return parentJson;
    }
    return json;
  }
}
