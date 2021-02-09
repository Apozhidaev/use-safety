import { program } from "commander";
import depfix from "../../depfix";
import * as lerna from "../lerna";

async function fix() {
  console.log("dep-fix: start...");
  await lerna.runAll(depfix);
  console.log("done!");
}

export default function use() {
  program.command("fix").description("fix lost dependencies").action(fix);
}
