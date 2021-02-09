import axios from "axios";
import urlJoin from "url-join";
import { PackageInfo, Artifact } from "../types";
import * as artifactCache from "./cache/artifact";
import * as canIUseCache from "./cache/canIUse";
import { Fiber } from "./cache/fiber";
import * as utils from "../utils";
import * as config from "../config";

export function getArtifact(name: string): Promise<Artifact | undefined> {
  if (artifactCache.has(name)) {
    return artifactCache.get(name);
  }

  if (config.tls()) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";
  }

  let auth;
  const username = config.username();
  const password = config.password();
  if (username && password) {
    auth = { username, password };
  }
  let headers;
  if (!auth) {
    const credentials = config.credentials();
    if (credentials) {
      headers = { Authorization: `${credentials.type} ${credentials.token}` };
    }
  }

  const promise = axios
    .get(urlJoin(config.registry(), name), { headers, auth })
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

export async function safetyPackage(name?: string) {
  if (!name) return name;
  const version = utils.version(name);
  if (version) {
    return name;
  }
  const artifact = await getArtifact(name);
  if (artifact) {
    const latest = artifact["dist-tags"].latest;
    if (artifact.versions[latest]) {
      return `${name}@${latest}`;
    }
    const versions = utils.availableVersions(artifact);
    if (versions.length > 0) {
      return `${name}@${versions[0]}`;
    }
  }
  return name;
}
