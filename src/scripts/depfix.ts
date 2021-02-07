import depfix from "../depfix";
import config from "../config";

async function run() {
  const cwd = config.rootDir;
  console.log("dep-fix: start...");
  await depfix(cwd);
  console.log("done!");
}

run();
