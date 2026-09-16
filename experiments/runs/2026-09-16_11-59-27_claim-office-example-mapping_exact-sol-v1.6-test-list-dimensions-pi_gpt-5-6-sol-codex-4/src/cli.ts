#!/usr/bin/env -S node --import tsx
import { runCli } from "./cli-adapter.js";

declare const process: {
  stdin: {
    setEncoding(encoding: string): void;
    on(event: "data", listener: (chunk: string) => void): void;
    on(event: "end", listener: () => void): void;
  };
  stdout: { write(output: string): void };
  stderr: { write(output: string): void };
  exitCode: number;
};

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const result = runCli(input);
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(`${result.stderr}\n`);
  process.exitCode = result.status;
});
