// The project does not install @types/node. These declarations cover exactly
// the Node.js APIs that the CLI adapter and its test use.

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}

declare module "node:url" {
  export function fileURLToPath(url: URL): string;
}

declare module "node:fs" {
  export function readFileSync(fileDescriptor: number, encoding: "utf8"): string;
}

declare const process: {
  stdout: { write(text: string): boolean };
  stderr: { write(text: string): boolean };
  exitCode?: number;
};
