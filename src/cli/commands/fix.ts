import { program } from "commander";
import * as npm from "../npm";
import * as lerna from "../lerna";

async function fix() {
  const options = program.opts();
  if (options.lerna) {
    await lerna.fix();
  } else {
    await npm.fix();
  }
}

export default function use() {
  program
    .command("fix")
    .description("fix lost dependencies")
    .action(fix);
}
