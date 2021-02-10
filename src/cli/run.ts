import { program } from "commander";
import * as config from "../config";
import useAdd from "./commands/add";
import useClean from "./commands/clean";
import useFix from "./commands/fix";
import useInstall from "./commands/install";

const pkg = require("../../package.json");

program
  .version(pkg.version)
  .option("--registry <url>", "use a custom registry to install the targeted package")
  .option("--username <user>", "user to login")
  .option("--password <pass>", "password for user")
  .option("--root-dir <path>", "root directory")
  .option("--tls", "if value equals ture, certificate validation is enable for TLS connections")
  .option("-d, --debug", "show resolved packages");

export default async function run() {
  const args = config.mainArgs();
  console.log("use-safety:", args.join(", "));
  useAdd();
  useClean();
  useFix();
  useInstall();
  await program.parseAsync(args);
}
