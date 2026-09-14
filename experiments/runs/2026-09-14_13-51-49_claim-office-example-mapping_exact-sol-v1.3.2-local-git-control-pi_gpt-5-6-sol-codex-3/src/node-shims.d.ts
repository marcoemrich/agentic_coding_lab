declare module "node:fs" {
  export function readFileSync(fileDescriptor: number, encoding: "utf8"): string;
}

declare module "node:child_process" {
  interface SpawnOptions {
    input: string;
    encoding: "utf8";
  }

  interface SpawnResult {
    status: number | null;
    stdout: string;
    stderr: string;
  }

  export function spawnSync(command: string, arguments_: string[], options: SpawnOptions): SpawnResult;
}

declare const process: {
  stdout: { write(content: string): void };
  stderr: { write(content: string): void };
  exitCode: number;
};
