import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";

const runCli = (stdin: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const cli = execFile(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      (error, stdout) => (error ? reject(error) : resolve(stdout)),
    );
    cli.stdin?.end(stdin);
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
