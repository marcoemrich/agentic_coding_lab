// Minimal ambient declarations for the Node globals the CLI uses. The project
// does not depend on @types/node; these cover only what src/cli.ts needs so
// the code type-checks without pulling in the full Node type surface.

interface NodeReadableStream {
  setEncoding(encoding: string): void;
  on(event: 'data', listener: (chunk: string) => void): void;
  on(event: 'end', listener: () => void): void;
  on(event: 'error', listener: (err: Error) => void): void;
}

interface NodeWritableStream {
  write(chunk: string): boolean;
}

interface NodeProcess {
  stdin: NodeReadableStream;
  stdout: NodeWritableStream;
  stderr: NodeWritableStream;
  exitCode?: number;
}

declare const process: NodeProcess;
