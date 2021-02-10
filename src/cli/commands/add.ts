import { program } from "commander";
import * as npm from "../npm";
import * as lerna from "../lerna";

async function add(pkg: string | undefined) {
  if (lerna.isLernaProject()) {
    await lerna.add(pkg);
  } else {
    await npm.add(pkg);
  }
}

export default function use() {
  program.command("add [package]").description("safety add [package] without install").action(add);
}
