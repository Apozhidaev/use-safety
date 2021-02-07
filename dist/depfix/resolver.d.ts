import { PackageJson } from "../types";
import BadPackage from "./badPackage";
export declare function resolveBadPackage(currentPackage: BadPackage, badPackages: BadPackage[], packageJson: PackageJson): Promise<void>;
