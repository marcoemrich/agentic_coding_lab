declare module "node:child_process" {
  interface SpawnResult {
    status: number | null;
    stdout: string;
    stderr: string;
  }
  export function spawnSync(command: string, args: string[], options: { input: string; encoding: string }): SpawnResult;
}

declare const process: {
  stdin: AsyncIterable<Uint8Array>;
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};
