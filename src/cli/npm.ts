import { program } from "commander";
import depfix from "../depfix";
import * as config from "../config";
import * as utils from "../utils";
import * as repo from "../repo";

type Options = {
  packageLockOnly?: boolean;
};

export async function fix() {
  const cwd = config.rootDir();
  console.log("dep-fix: start...");
  await depfix(cwd);
  console.log("done!");
}

export async function install(pkg?: string) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  const safetyPackage = await repo.safetyPackage(pkg);
  const command = `npm i ${safetyPackage || ""} ${args.join(" ")}`;
  await utils.shell(`${command} --package-lock-only`, cwd);
  console.log("dep-fix: start...");
  await depfix(cwd);
  const options: Options = program.opts();
  if (!options.packageLockOnly) {
    await utils.shell(command, cwd);
  }
  console.log("done!");
}
