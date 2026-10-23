declare module "node:fs" {
  export function readFileSync(fd: number, encoding: string): string;
}

declare module "node:child_process" {
  export interface SpawnSyncReturns {
    status: number | null;
    stdout: string;
    stderr: string;
  }
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: string },
  ): SpawnSyncReturns;
}

declare module "node:process" {
  export const argv: string[];
  export const stdout: { write: (text: string) => void };
  export const stderr: { write: (text: string) => void };
  export function exit(code: number): never;
}
