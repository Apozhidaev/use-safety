import { program, OptionValues } from "commander";
import * as utils from "../../utils";
import * as lerna from "../lerna";

async function clean(location: string, options: OptionValues) {
  await utils.removeFile(location, "resolved_packages.json");
  await utils.removeFile(location, "UNRESULVED_packages.json");
  if (options.packageLock || options.all) {
    await utils.removeFile(location, "package-lock.json");
  }
  if (options.nodeModules || options.all) {
    await utils.removeDir(location, "node_modules");
  }
}

async function cleanAll(options: OptionValues) {
  console.log("clean: start...");
  await lerna.runAll((location) => clean(location, options));
  console.log("done!");
}

export default function use() {
  program
    .command("clean")
    .description("remove util")
    .option("-m, --node-modules", "remove node_modules")
    .option("-l, --package-lock", "remove package-lock.json")
    .option("-a, --all", "remove all")
    .action(cleanAll);
}
