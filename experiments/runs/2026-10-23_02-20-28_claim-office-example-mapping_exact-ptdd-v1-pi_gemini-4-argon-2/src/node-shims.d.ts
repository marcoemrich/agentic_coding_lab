declare module "node:fs" {
  export function readFileSync(fd: number | string, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export interface SpawnSyncOptionsWithStringEncoding {
    input?: string;
    encoding: "utf8";
  }

  export interface SpawnSyncReturns<T> {
    status: number | null;
    stdout: T;
    stderr: T;
  }

  export function spawnSync(
    command: string,
    args: readonly string[],
    options: SpawnSyncOptionsWithStringEncoding,
  ): SpawnSyncReturns<string>;
}

declare const process: {
  execPath: string;
  exitCode?: number;
  stdout: {
    write(chunk: string): boolean;
  };
  stderr: {
    write(chunk: string): boolean;
  };
};
