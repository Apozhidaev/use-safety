import { DependencyMap, PackageParent } from "../types";
import BadPackage from "./badPackage";
export declare function processDependencies(dependencies: DependencyMap | undefined, badPackages: BadPackage[], parent?: PackageParent): Promise<void>;
