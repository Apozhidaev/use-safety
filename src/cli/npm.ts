import depfix from "../depfix";
import * as config from "../config";
import * as utils from "../utils";
import * as repo from "../repo";

export async function add(pkg: string | undefined) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  const safetyPackage = await repo.safetyPackage(pkg);
  console.log("create package-lock.json: start...");
  await utils.shell(`npm i ${safetyPackage || ""} ${args.join(" ")} --package-lock-only`, cwd);
  console.log("done!");
  console.log("fix dependencies: start...");
  await depfix(cwd);
  console.log("done!");
}

export async function install(pkg: string | undefined) {
  await add(pkg);
  console.log("install: start...");
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  await utils.shell(`npm i ${args.join(" ")}`, cwd);
  console.log("done!");
}
