import fs from "fs";
import { EOL } from "os";
import rimraf from "rimraf";
import * as semver from "semver";
import * as jsonfile from "jsonfile";
import * as path from "path";
import { Artifact } from "./types";
import child_process from "child_process";

const jsonOptions = { spaces: 4, EOL };

export function saveJson(location: string, file: string, json: object) {
  jsonfile.writeFileSync(path.join(location, file), json, jsonOptions);
}

export function loadJson(location: string, file: string) {
  return jsonfile.readFileSync(path.join(location, file));
}

export function checkFile(location: string, file: string) {
  return fs.existsSync(path.join(location, file));
}

export function removeFile(location: string, file: string) {
  try {
    const filePath = path.join(location, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.log(error);
  }
}

export function removeDir(location: string, dir: string) {
  try {
    const dirPath = path.join(location, dir);
    if (fs.existsSync(dirPath)) {
      rimraf.sync(dirPath);
    }
  } catch (error) {
    console.log(error);
  }
}

export function shell(command: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    const proc = child_process.exec(command, { cwd }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
    proc.stdout?.on("data", (data) => {
      console.log(data);
    });
    proc.stderr?.on("data", (data) => {
      console.error(data);
    });
  });
}

export function availableVersions(artifact: Artifact, require?: string) {
  const versions = Object.keys(artifact.versions);
  semver.rsort(versions);
  return require ? versions.filter((version) => semver.satisfies(version, require)) : versions;
}

export function shasumToIntegrity(shasum: string) {
  const base64 = Buffer.from(shasum, "hex").toString("base64");
  switch (base64.length) {
    case 88:
      return `sha512-${base64}`;
    case 28:
      return `sha1-${base64}`;
    default:
      return "";
  }
}

export function version(pkg: string) {
  const parts = pkg.split("@");
  if (parts.length > 1) {
    return semver.clean(parts[parts.length - 1]);
  }
  return null;
}
