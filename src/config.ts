import path from "path";
import { program } from "commander";
import getAuthToken, { NpmCredentials } from "registry-auth-token";
import registryUrl from "registry-auth-token/registry-url";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
require("dotenv").config();

const currentRegistry = registryUrl("");
const currentCredentials = getAuthToken({});

export const registry = (): string =>
  program.opts().registry || process.env.USE_SAFETY_REGISTRY || currentRegistry;

export const username = (): string | undefined =>
  program.opts().username || process.env.USE_SAFETY_USERNAME;

export const password = (): string | undefined =>
  program.opts().password || process.env.USE_SAFETY_PASSWORD;

export const auth = (): string | undefined => program.opts().auth || process.env.USE_SAFETY_AUTH;

export const authToken = (): string | undefined =>
  program.opts().authToken || process.env.USE_SAFETY_AUTH_TOKEN;

export const credentials = (): NpmCredentials | undefined => {
  if (authToken()) {
    return { token: authToken()!, type: "Bearer" };
  }
  if (auth()) {
    return { token: auth()!, type: "Basic" };
  }
  return currentCredentials;
};

export const rootDir = (): string =>
  path.resolve(program.opts().rootDir || process.env.USE_SAFETY_ROOT_DIR || ".");

export const debug = (): boolean => program.opts().debug === true || process.env.DEBUG === "true";
export const tls = (): boolean => program.opts().tls === true;

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
