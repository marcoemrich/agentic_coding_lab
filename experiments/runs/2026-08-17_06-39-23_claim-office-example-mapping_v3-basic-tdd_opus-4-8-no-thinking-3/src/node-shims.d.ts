// Minimal ambient declarations for the Node APIs used by the CLI.
// The project does not depend on @types/node; the CLI runs under tsx at
// runtime. These shims keep `tsc --noEmit` honest for the surface we use.

declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: 'data', listener: (chunk: string) => void): void;
    on(event: 'end', listener: () => void): void;
    on(event: 'error', listener: (err: unknown) => void): void;
  };
  stdout: { write(data: string): void };
  stderr: { write(data: string): void };
  exit(code: number): never;
};
