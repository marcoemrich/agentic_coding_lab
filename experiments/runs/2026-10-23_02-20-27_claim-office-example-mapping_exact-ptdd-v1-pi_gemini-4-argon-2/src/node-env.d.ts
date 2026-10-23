declare module "node:fs" {
  export function readFileSync(fd: number | string, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export interface SpawnSyncOptionsWithStringEncoding {
    input?: string;
    encoding: "utf8";
  }
  export interface SpawnSyncReturnsString {
    status: number | null;
    stdout: string;
    stderr: string;
  }
  export function spawnSync(
    command: string,
    args: readonly string[],
    options: SpawnSyncOptionsWithStringEncoding,
  ): SpawnSyncReturnsString;
}

declare const process: {
  execPath: string;
  exit(code?: number): never;
  stdout: {
    write(chunk: string): boolean;
  };
  stderr: {
    write(chunk: string): boolean;
  };
};
