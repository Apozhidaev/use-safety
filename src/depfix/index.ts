import BadPackage from "./badPackage";
import { processDependencies } from "./processor";
import { resolveBadPackage } from "./resolver";
import { PackageLock } from "../types";
import * as utils from "../utils";
import * as config from "../config";

export default async function run(location: string) {
  try {
    if (!utils.checkFile(location, "package.json")) {
      return;
    }
    if (!utils.checkFile(location, "package-lock.json")) {
      console.warn(location, "package-lock.json - NOT FOUND");
      return;
    }
    const packageJson = utils.loadJson(location, "package.json");
    const packageLock: PackageLock = utils.loadJson(location, "package-lock.json");

    if (packageLock.lockfileVersion && packageLock.lockfileVersion >= 2) {
      console.warn(location, `Lock file version: ${packageLock.lockfileVersion} - NOT SUPPORTED`);
      return;
    }

    const badPackages: BadPackage[] = [];
    await processDependencies(packageLock.dependencies, badPackages);

    while (badPackages.some((badPackage) => badPackage.resolved === undefined)) {
      const unresolvedPackages = badPackages.filter((badCase) => badCase.resolved === undefined);
      for (let i = 0; i < unresolvedPackages.length; i++) {
        const currentPackage = unresolvedPackages[i];
        await resolveBadPackage(currentPackage, badPackages, packageJson);
      }
    }

    if (badPackages.length > 0) {
      utils.saveJson(location, "package-lock.json", packageLock);
    }

    const resolvedPackages = badPackages.filter((x) => x.resolved);
    if (config.debug() && resolvedPackages.length) {
      utils.saveJson(location, "resolved_packages.json", resolvedPackages);
    }

    const unresolvedPackages = badPackages.filter((x) => !x.resolved);
    if (unresolvedPackages.length) {
      utils.saveJson(location, "UNRESULVED_packages.json", unresolvedPackages);
    }
  } catch (err) {
    console.log(location, err);
  }
}
