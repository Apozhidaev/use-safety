import { program } from "commander";
import * as utils from "../utils";
import depfix from "../depfix";
import * as config from "../config";
import * as repo from "../repo";
const { getPackages } = require("@lerna/project");

type Options = {
  packageLockOnly?: boolean;
};

type GlobalOptions = {
  npx?: boolean;
};

export async function run(location: string, task: (location: string) => Promise<void>) {
  console.log(`${location} - start...`);
  await task(location);
  console.log(`${location} - done!`);
}

export async function runAll(task: (location: string) => Promise<void>) {
  const cwd = config.rootDir();
  await run(cwd, task);
  const packages = await getPackages(cwd);
  for (let i = 0; i < packages.length; i++) {
    await run(packages[i].location, task);
  }
}

export async function install(pkg: string | undefined, options: Options) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  const globalOptions: GlobalOptions = program.opts();
  const safetyPackage = await repo.safetyPackage(pkg);
  const command = `${globalOptions.npx ? "npx" : "npm"} lerna ${
    safetyPackage ? `add ${safetyPackage}` : "bootstrap"
  } ${args.join(" ")}`;
  console.log("create-package-lock: start...");
  await utils.shell(`${command} -- --package-lock-only`, cwd);
  console.log("dep-fix: start...");
  await runAll(depfix);
  if (!options.packageLockOnly) {
    console.log("install: start...");
    await utils.shell(command, cwd);
  }
  console.log("done!");
}
