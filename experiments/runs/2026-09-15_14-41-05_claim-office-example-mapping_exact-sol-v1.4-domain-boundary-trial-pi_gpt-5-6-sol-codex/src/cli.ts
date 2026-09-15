import { executeCli } from "./cli-adapter.js";

interface Stream {
  write(value: string): void;
}

interface InputStream {
  setEncoding(encoding: string): void;
  on(event: string, listener: (chunk?: string) => void): void;
}

declare const process: {
  stdin: InputStream;
  stdout: Stream;
  stderr: Stream;
  exitCode: number;
};

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk = "") => {
  input += chunk;
});
process.stdin.on("end", () => {
  const result = executeCli(input);
  process.exitCode = result.status;
  if (result.stdout !== "") process.stdout.write(result.stdout);
  if (result.stderr !== "") process.stderr.write(`${result.stderr}\n`);
});
