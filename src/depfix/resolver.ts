import * as semver from "semver";
import { Dependent, PackageJson } from "../types";
import BadPackage from "./badPackage";
import * as repo from "../repo";
import * as utils from "../utils";

async function canIResolve(name: string, version: string, dependents: Dependent[]) {
  return (
    dependents.every((dependent) => semver.satisfies(version, dependent.require)) &&
    (await repo.canIUse(name, version))
  );
}

export async function resolveBadPackage(
  currentPackage: BadPackage,
  badPackages: BadPackage[],
  packageJson: PackageJson
) {
  const { name, dependents, meta } = currentPackage;
  let require;
  if (dependents.length === 0) {
    if (!meta.parent) {
      require = packageJson.dependencies?.[name] || packageJson.devDependencies?.[name];

      if (!require) {
        const artifact = await repo.getArtifact(name);
        currentPackage.asUnresolved(utils.availableVersions(artifact!));
        return;
      }
    } else {
      badPackages.push(new BadPackage(meta.parent.name, meta.parent.version, meta.parent.meta));
      currentPackage.remove();
      return;
    }
  }

  const artifact = (await repo.getArtifact(name))!;
  const versions = utils.availableVersions(artifact, require);

  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    if (await canIResolve(name, version, dependents)) {
      const dist = artifact.versions[version].dist;
      currentPackage.replace({
        version: artifact.versions[version].version,
        resolved: artifact.versions[version].dist.tarball,
        integrity:
          dist.integrity || utils.shasumToIntegrity(artifact.versions[version].dist.shasum),
      });
      return;
    }
  }

  for (let i = 0; i < dependents.length; i++) {
    const dependent = dependents[i];
    const canIUse = await repo.canIUse(dependent.name, dependent.version);
    if (!canIUse) {
      badPackages.push(new BadPackage(dependent.name, dependent.version, currentPackage.meta));
    }
  }
  currentPackage.remove();
}
