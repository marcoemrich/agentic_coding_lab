/**
 * Minimal ambient declarations for the Node APIs this project uses.
 *
 * `@types/node` is not among the project's dependencies and cannot be
 * installed here, so the CLI and its test would otherwise fail `tsc`. These
 * declarations cover only what is actually referenced; they are a stand-in
 * for `@types/node`, not a description of Node's real API surface.
 */

declare const Buffer: {
  concat(list: Uint8Array[]): { toString(encoding: string): string };
};

declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write(chunk: string): boolean };
  stderr: { write(chunk: string): boolean };
  exitCode: number;
};

declare module "node:child_process" {
  export function execFile(
    file: string,
    args: string[],
    callback: (
      error: (Error & { code?: number }) | null,
      stdout: string,
      stderr: string,
    ) => void,
  ): { stdin: { end(chunk: string): void } | null };
}

declare module "node:url" {
  export function fileURLToPath(url: URL | string): string;
}
