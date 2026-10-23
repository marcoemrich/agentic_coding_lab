declare module "node:fs" {
  export function readFileSync(fd: number, encoding: "utf8"): string;
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
  readonly execPath: string;
  readonly argv: readonly string[];
  exitCode?: number;
  readonly stdout: {
    write(chunk: string): boolean;
  };
  readonly stderr: {
    write(chunk: string): boolean;
  };
  exit(code?: number): never;
};
