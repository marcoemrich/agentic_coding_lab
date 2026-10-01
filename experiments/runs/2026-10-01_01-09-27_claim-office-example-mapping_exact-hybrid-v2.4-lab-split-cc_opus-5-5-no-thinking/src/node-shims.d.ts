// Minimal Node typings for the APIs used here (@types/node is not installed).
declare module "node:fs" {
  export function readFileSync(fd: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}

declare const process: {
  stdout: { write(text: string): boolean };
  stderr: { write(text: string): boolean };
  exitCode: number | undefined;
};
