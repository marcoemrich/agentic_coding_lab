declare module "node:child_process" {
  export function spawnSync(command: string, args: string[], options: Record<string, unknown>): {
    status: number | null;
    stdout: string;
    stderr: string;
  };
}

declare module "node:process" {
  const process: {
    stdin: {
      setEncoding(encoding: string): void;
      on(event: string, listener: (chunk: string) => void): void;
    };
    stdout: { write(content: string): void };
  };
  export default process;
}
