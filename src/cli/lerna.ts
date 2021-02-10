import path from "path";
import * as utils from "../utils";
import depfix from "../depfix";
import * as config from "../config";
import * as repo from "../repo";
const { getPackages } = require("@lerna/project");

const lernaAddOptions = new Set(["-D", "--dev", "-E", "--exact", "-P", "--peer", "--no-bootstrap"]);

function hasLocalCLI() {
  return utils.checkFile(config.rootDir(), "node_modules/lerna/cli.js");
}

function runner() {
  return hasLocalCLI()
    ? `node ${path.join(config.rootDir(), "node_modules/lerna/cli.js")}`
    : "npx lerna";
}

function bootstrap() {
  const args = config.additionalArgs();
  return `${runner()} bootstrap ${args.filter((arg) => !lernaAddOptions.has(arg)).join(" ")}`;
}

export function isLernaProject() {
  return utils.checkFile(config.rootDir(), "lerna.json");
}

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

export async function add(pkg: string | undefined) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  if (pkg) {
    const safetyPackage = await repo.safetyPackage(pkg);
    const command = `${runner()} add ${safetyPackage} ${args.join(" ")} --no-bootstrap`;
    console.log("add package: start...");
    await utils.shell(`${command}`, cwd);
    console.log("done!");
  }
  console.log("create package-lock.json: start...");
  await utils.shell(`${bootstrap()} -- --package-lock-only`, cwd);
  console.log("done!");
  console.log("fix dependencies: start...");
  await runAll(depfix);
  console.log("done!");
}

export async function install(pkg: string | undefined) {
  await add(pkg);
  console.log("install: start...");
  await utils.shell(bootstrap(), config.rootDir());
  console.log("done!");
}
