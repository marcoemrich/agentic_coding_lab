declare module "node:fs" {
  export function readFileSync(path: number, encoding: string): string;
}

declare const process: {
  stdout: { write(value: string): void };
  stderr: { write(value: string): void };
  exitCode?: number;
};
