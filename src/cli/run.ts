import { program } from "commander";
import * as config from "../config";
import useFix from "./commands/fix";
import useInstall from "./commands/install";
import useClean from "./commands/clean";

const pkg = require("../../package.json");

program
  .version(pkg.version)
  .option("--registry <url>", "use a custom registry to install the targeted package")
  .option("--username <user>", "user to login")
  .option("--password <pass>", "password for user")
  .option("--root-dir <path>", "root directory")
  .option(
    "--tls",
    "if value equals ture, certificate validation is enable for TLS connections"
  )
  .option("-d, --debug", "show resolved packages")
  .option("--lerna", "use lerna")
  .option("--npx", "use npx");

export default async function run() {
  const args = config.mainArgs();
  console.log("use-safety:", args.join(", "));
  useFix();
  useInstall();
  useClean();
  await program.parseAsync(args);
}
