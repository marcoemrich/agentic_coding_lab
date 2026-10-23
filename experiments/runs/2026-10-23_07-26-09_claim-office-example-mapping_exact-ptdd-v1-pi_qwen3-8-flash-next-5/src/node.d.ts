declare module "node:fs" {
  export function readFileSync(fd: number, encoding: string): string;
}

declare module "node:url" {
  export function pathToFileURL(path: string): { href: string };
}

declare var process: {
  argv: string[];
  stderr: { write(s: string): void };
  stdout: { write(s: string): void };
  exit(code: number): never;
};
