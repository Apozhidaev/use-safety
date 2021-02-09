import { program } from "commander";
import * as npm from "../npm";
import * as lerna from "../lerna";

async function install(pkg?: string) {
  const options = program.opts();
  if (options.lerna) {
    await lerna.install(pkg);
  } else {
    await npm.install(pkg);
  }
}

export default function use() {
  program
    .command("install [package]")
    .alias("i")
    .description("safety install [package]")
    .option(
      "--package-lock-only",
      "if --package-lock-only is provided, it will do this without also modifying your local node_modules"
    )
    .action(install);
}
