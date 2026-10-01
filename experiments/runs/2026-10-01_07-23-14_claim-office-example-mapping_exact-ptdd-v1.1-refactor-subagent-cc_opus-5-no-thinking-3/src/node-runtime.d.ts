// The project has no @types/node and the environment is offline, so the few
// Node APIs the CLI adapter and its test need are declared here rather than
// weakening the type gate for all of src/.

declare module "node:fs" {
  export function readFileSync(
    fileDescriptor: number,
    encoding: "utf8",
  ): string;
}

declare module "node:child_process" {
  export function execFileSync(
    file: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): string;
  export function spawnSync(
    file: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}

declare module "node:url" {
  export function fileURLToPath(url: URL): string;
}

declare const process: {
  stdout: { write(text: string): boolean };
  stderr: { write(text: string): boolean };
  exit(code: number): never;
};
