declare module "node:child_process" {
  interface SpawnOptions { input: string; encoding: "utf8" }
  interface SpawnResult { status: number | null; stdout: string; stderr: string }
  export function spawnSync(command: string, args: string[], options: SpawnOptions): SpawnResult;
}

declare module "node:fs" {
  export function readFileSync(file: number, encoding: "utf8"): string;
}

declare const process: { exitCode: number };
