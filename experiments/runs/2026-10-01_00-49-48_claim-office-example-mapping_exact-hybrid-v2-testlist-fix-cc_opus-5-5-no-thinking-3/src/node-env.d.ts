// Minimal Node.js declarations for the CLI and its test (@types/node is not installed).
declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
  };
  stdout: { write(text: string): void };
  stderr: { write(text: string): void };
  exitCode?: number;
};

declare module "node:child_process" {
  export function spawnSync(
    command: string,
    args: string[],
    options: { input: string; encoding: "utf8" },
  ): { status: number | null; stdout: string; stderr: string };
}
