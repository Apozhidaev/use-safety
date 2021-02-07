import { Command } from "commander";
import { shell } from "./utils";
import depfix from "./depfix";
import config from "./config";

const pkg = require("../package.json");
const program = new Command();

program
  .version(pkg.version)
  .option("--registry <url>", "Use a custom registry to install the targeted package.")
  .option("--username <user>", "User to login.")
  .option("--password <pass>", "Password for user.")
  .option("--root-dir <path>", "Root directory.")
  .option("--no-tls", "If value equals ture, certificate validation is disabled for TLS connections. ")
  .option("--log", "Show resolved packages.")
  .option("-D, --save-dev", "Add the new package to devDependencies instead of dependencies.");

async function npmInstall(p?: string) {
  const options = program.opts();
  config.update(options);
  const cwd = config.rootDir;
  const command = `npm i ${p || ""} ${options.saveDev ? "--save-dev" : ""}`;
  await shell(`${command} --package-lock-only`, cwd);
  console.log("dep-fix: start...");
  await depfix(cwd);
  await shell(command, cwd);
  console.log("done!");
}

export default async function run(argv: string[]) {
  console.log("use-safety:", argv.join(", "));
  const args = argv.filter((arg) => arg !== "--");
  program.command("install [package]").alias("i").description("Run npm install [package]").action(npmInstall);
  await program.parseAsync(args);
}
