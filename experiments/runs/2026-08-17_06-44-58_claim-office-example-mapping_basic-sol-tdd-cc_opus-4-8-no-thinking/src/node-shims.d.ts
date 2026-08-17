// Minimal ambient declarations for the Node APIs used by the CLI.
// The project does not depend on @types/node; these cover only what src/cli.ts
// needs so the TypeScript gate can check the CLI without a new dependency.

declare module "node:fs" {
  export function readFileSync(fd: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  export function execFileSync(
    file: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): string;
}

declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}

interface ImportMeta {
  url: string;
}

declare const process: {
  stdout: { write(data: string): void };
  stderr: { write(data: string): void };
  exit(code: number): never;
};
