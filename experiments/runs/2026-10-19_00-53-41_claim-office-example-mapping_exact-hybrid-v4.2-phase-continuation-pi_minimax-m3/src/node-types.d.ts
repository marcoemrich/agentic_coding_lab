// Minimal type declarations for Node.js globals used by the CLI.
// Avoids requiring @types/node as a dev dependency.
declare const process: {
  stdin: AsyncIterable<Buffer | string>;
  stdout: { write(s: string): boolean };
  stderr: { write(s: string): boolean };
  argv: string[];
  exit(code: number): never;
};
