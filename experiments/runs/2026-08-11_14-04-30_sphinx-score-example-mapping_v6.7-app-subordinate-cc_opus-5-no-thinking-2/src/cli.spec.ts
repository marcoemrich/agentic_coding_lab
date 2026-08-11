import { describe, it, expect } from "vitest";
import { spawn } from "node:child_process";

const runCli = (input: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["exec", "tsx", "src/cli.ts"], {
      cwd: process.cwd(),
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => (stdout += chunk));
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0
        ? resolve(stdout)
        : reject(new Error(`cli exited with ${code}: ${stderr}`)),
    );

    child.stdin.end(input);
  });

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and writes the score to stdout", async () => {
    const stdout = await runCli(
      JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 2 },
          { monster: "hydra" },
        ],
      }),
    );

    expect(JSON.parse(stdout)).toEqual({ score: 2 });
  });
});
