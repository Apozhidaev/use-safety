import { OptionValues } from "commander";
declare const config: {
    registry: string;
    username: string | undefined;
    password: string | undefined;
    rootDir: string;
    log: boolean;
    update: (options: OptionValues) => void;
};
export default config;
