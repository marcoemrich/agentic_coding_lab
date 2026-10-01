// Minimal Node declarations (no @types/node installed in this project).
declare module "node:fs" {
  export function readFileSync(fd: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { stdout: string; stderr: string; status: number | null };
}

declare const process: {
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exitCode: number | undefined;
};
