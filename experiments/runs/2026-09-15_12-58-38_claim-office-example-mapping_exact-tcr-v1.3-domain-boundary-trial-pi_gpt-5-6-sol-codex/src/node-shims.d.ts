declare module "node:fs" {
  export function readFileSync(path: number, encoding: string): string;
}

declare module "node:child_process" {
  export interface SpawnResult {
    status: number | null;
    stdout: string;
    stderr: string;
  }
  export function spawnSync(command: string, args: string[], options: { input: string; encoding: string }): SpawnResult;
}

declare const process: {
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};
