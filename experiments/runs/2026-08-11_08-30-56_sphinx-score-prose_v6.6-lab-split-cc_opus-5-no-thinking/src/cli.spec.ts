import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

const runCli = (stdin: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const cli = spawn("npx", ["tsx", "src/cli.ts"], { stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    cli.stdout.on("data", (chunk) => (stdout += chunk));
    cli.stderr.on("data", (chunk) => (stderr += chunk));
    cli.on("error", reject);
    cli.on("close", (code) =>
      code === 0 ? resolve(stdout) : reject(new Error(`exit ${code}: ${stderr}`)),
    );
    cli.stdin.end(stdin);
  });

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and writes the score to stdout — the spec example is 1", async () => {
    const stdout = await runCli(
      '{"army":[{"monster":"sphinx"},{"monster":"undead-warrior","rank":2},{"monster":"hydra"}]}',
    );

    expect(JSON.parse(stdout)).toEqual({ score: 1 });
  });
});
