import { program, OptionValues } from "commander";
import * as npm from "../npm";
import * as lerna from "../lerna";

async function install(pkg: string | undefined, options: OptionValues) {
  const globalOptions = program.opts();
  if (globalOptions.lerna) {
    await lerna.install(pkg, options);
  } else {
    await npm.install(pkg, options);
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
