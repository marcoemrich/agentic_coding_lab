// Minimal Node.js typings (no @types/node in this project).
declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}

declare module "node:fs" {
  export function readFileSync(fd: number, encoding: "utf8"): string;
}

declare const process: {
  stdout: { write(text: string): void };
};
