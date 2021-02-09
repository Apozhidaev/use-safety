import { program } from "commander";
import * as utils from "../utils";
import depfix from "../depfix";
import * as config from "../config";
const { getPackages } = require("@lerna/project");

type Options = {
  npx?: boolean;
  packageLockOnly?: boolean;
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

export async function fix() {
  await runAll(depfix);
  console.log("done!");
}

export async function install(pkg?: string) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  const options: Options = program.opts();
  const command = `${options.npx ? "npx" : "npm"} lerna ${
    pkg ? `add ${pkg}` : "bootstrap"
  } ${args.join(" ")}`;
  await utils.shell(`${command} -- --package-lock-only`, cwd);
  await runAll(depfix);
  if (!options.packageLockOnly) {
    await utils.shell(command, cwd);
  }
  console.log("done!");
}
