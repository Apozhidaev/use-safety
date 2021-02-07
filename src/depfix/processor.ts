import { DependencyMap, PackageParent } from "../types";
import BadPackage from "./badPackage";
import * as repo from "../repo";

async function badVersion(name: string, version: string) {
  const artifact = await repo.getArtifact(name);
  return !artifact || Object.keys(artifact.versions).every((x) => x !== version);
}

export async function processDependencies(
  dependencies: DependencyMap | undefined,
  badPackages: BadPackage[],
  parent?: PackageParent
) {
  if (!dependencies) return;
  const packages = Object.keys(dependencies);
  const meta = {
    parent,
    packages,
    dependencies,
  };
  await Promise.all(
    packages.map(async (name) => {
      const dependency = dependencies[name];
      if (await badVersion(name, dependency.version)) {
        badPackages.push(new BadPackage(name, dependency.version, meta));
        return;
      }

      if (dependency.dependencies) {
        await processDependencies(
          dependency.dependencies,
          badPackages,
          (parent = {
            meta,
            name,
            version: dependency.version,
          })
        );
      }
    })
  );
}
