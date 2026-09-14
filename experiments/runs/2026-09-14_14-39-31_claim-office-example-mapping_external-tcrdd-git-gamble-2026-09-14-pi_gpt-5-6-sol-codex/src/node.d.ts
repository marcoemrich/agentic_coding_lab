declare const process: {
  stdin: AsyncIterable<unknown>;
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};

declare module 'node:child_process' {
  interface SpawnOptions { encoding: string; input: string }
  interface SpawnResult { status: number | null; stdout: string; stderr: string }
  export function spawnSync(command: string, args: string[], options: SpawnOptions): SpawnResult;
}
