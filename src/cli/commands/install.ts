import { program } from "commander";
import * as npm from "../npm";
import * as lerna from "../lerna";

async function install(pkg: string | undefined) {
  if (lerna.isLernaProject()) {
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
    .action(install);
}
