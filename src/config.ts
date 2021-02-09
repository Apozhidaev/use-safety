import path from "path";
import { program } from "commander";
import registryUrl from "registry-url";

require("dotenv").config();
const currentRegistry = registryUrl();

export const registry = (): string =>
  program.opts().registry || process.env.USE_SAFETY_REGISTRY || currentRegistry;

export const username = (): string | undefined =>
  program.opts().username || process.env.USE_SAFETY_USERNAME;

export const password = (): string | undefined =>
  program.opts().password || process.env.USE_SAFETY_PASSWORD;

export const rootDir = (): string =>
  path.resolve(program.opts().rootDir || process.env.USE_SAFETY_ROOT_DIR || ".");

export const debug = (): boolean => program.opts().debug === true || process.env.DEBUG === "true";

export function mainArgs() {
  const splitIndex = process.argv.indexOf("--");
  if (splitIndex > 0) {
    return process.argv.slice(0, splitIndex);
  }
  return process.argv;
}

export function additionalArgs() {
  const splitIndex = process.argv.indexOf("--");
  if (splitIndex > 0) {
    return process.argv.slice(splitIndex + 1);
  }
  return [];
}
