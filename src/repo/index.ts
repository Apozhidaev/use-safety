import axios from "axios";
import urlJoin from "url-join";
import { PackageInfo, Artifact } from "../types";
import * as artifactCache from "./cache/artifact";
import * as canIUseCache from "./cache/canIUse";
import { Fiber } from "./cache/fiber";
import * as utils from "../utils";
import config from "../config";

export function getArtifact(name: string): Promise<Artifact | undefined> {
  if (artifactCache.has(name)) {
    return artifactCache.get(name);
  }

  let auth;
  if (config.username && config.password) {
    auth = { username: config.username, password: config.password };
  }

  const promise = axios
    .get(urlJoin(config.registry, name), { auth })
    .then((res) => res.data)
    .catch((error) => {
      if (error.response?.status === 404) {
        console.log(`${name} - Not Found`);
        return undefined;
      }
      throw error;
    });

  artifactCache.add(name, promise);
  return promise;
}

async function checkDependencies({ dependencies }: PackageInfo, fiber: Fiber) {
  if (!dependencies) {
    return true;
  }
  const results = await Promise.all(
    Object.keys(dependencies)
      .filter((name) => !fiber.has(name, dependencies[name])) // remove circular dependencies
      .map((name) => canIUse(name, dependencies[name], fiber))
  );
  return results.every((yes) => yes);
}

async function checkPackage(name: string, range: string, fiber: Fiber) {
  const artifact = await getArtifact(name);
  if (!artifact) {
    return false;
  }
  const versions = utils.availableVersions(artifact, range);
  for (let i = 0; i < versions.length; i++) {
    const version = versions[i];
    if (await checkDependencies(artifact.versions[version], fiber)) {
      return true;
    }
  }
  return false;
}

export function canIUse(name: string, range: string, fiber: Fiber = new Fiber()) {
  fiber.add(name, range);
  if (canIUseCache.has(name, range)) {
    return canIUseCache.get(name, range);
  }
  const promise = checkPackage(name, range, fiber);
  canIUseCache.add(name, range, promise);
  return promise;
}
