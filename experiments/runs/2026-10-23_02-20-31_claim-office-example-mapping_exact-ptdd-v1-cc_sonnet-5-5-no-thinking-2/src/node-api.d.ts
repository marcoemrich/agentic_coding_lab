declare module "node:fs" {
  export function readFileSync(fileDescriptor: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}

declare const process: {
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exitCode: number | undefined;
};
