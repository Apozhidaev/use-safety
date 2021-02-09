export declare function run(location: string, task: (location: string) => Promise<void>): Promise<void>;
export declare function runAll(task: (location: string) => Promise<void>): Promise<void>;
export declare function fix(): Promise<void>;
export declare function install(pkg?: string): Promise<void>;
