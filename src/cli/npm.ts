import depfix from "../depfix";
import * as config from "../config";
import * as utils from "../utils";
import * as repo from "../repo";

type Options = {
  packageLockOnly?: boolean;
};

export async function install(pkg: string | undefined, options: Options) {
  const cwd = config.rootDir();
  const args = config.additionalArgs();
  const safetyPackage = await repo.safetyPackage(pkg);
  const command = `npm i ${safetyPackage || ""} ${args.join(" ")}`;
  console.log("create-package-lock: start...");
  await utils.shell(`${command} --package-lock-only`, cwd);
  console.log("dep-fix: start...");
  await depfix(cwd);
  if (!options.packageLockOnly) {
    console.log("install: start...");
    await utils.shell(command, cwd);
  }
  console.log("done!");
}
