import path from "path";
import { OptionValues } from "commander";
import registryUrl from "registry-url";
require("dotenv").config();

const config = {
  registry: process.env.USE_SAFETY_REGISTRY || registryUrl(),
  username: process.env.USE_SAFETY_USERNAME,
  password: process.env.USE_SAFETY_PASSWORD,
  rootDir: path.resolve(process.env.USE_SAFETY_ROOT_DIR || "."),
  log: !!process.env.USE_SAFETY_LOG && process.env.USE_SAFETY_LOG !== "0",

  update: (options: OptionValues) => {
    config.registry = options.registry || config.registry;
    config.username = options.username || config.username;
    config.password = options.password || config.password;
    config.rootDir = options.rootDir ? path.resolve(options.rootDir) : config.rootDir;
    config.log = options.log === true || config.log;

    if (options.noTls) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
  },
};

export default config;
