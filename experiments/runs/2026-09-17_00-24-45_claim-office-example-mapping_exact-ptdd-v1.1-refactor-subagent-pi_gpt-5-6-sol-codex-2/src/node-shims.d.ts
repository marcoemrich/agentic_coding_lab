declare module "node:fs" {
  export function readFileSync(file: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  interface SpawnResult {
    status: number | null;
    stdout: string;
    stderr: string;
  }
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): SpawnResult;
}

declare const process: {
  execPath: string;
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};
