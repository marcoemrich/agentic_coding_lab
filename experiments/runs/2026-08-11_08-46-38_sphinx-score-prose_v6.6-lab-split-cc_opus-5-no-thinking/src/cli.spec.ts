import { describe, it, expect } from "vitest";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const runCli = (stdin: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const child = execFile(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { cwd: projectRoot },
      (error, stdout, stderr) => {
        if (error) reject(new Error(`${error.message}\nstderr: ${stderr}`));
        else resolve(stdout);
      },
    );
    child.stdin?.end(stdin);
  });

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and writes the score as JSON — the spec example scores 1", async () => {
    const stdout = await runCli(
      JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 2 },
          { monster: "hydra" },
        ],
      }),
    );

    expect(JSON.parse(stdout)).toEqual({ score: 1 });
  }, 30000);

  it("scores an empty army as 0 end to end", async () => {
    const stdout = await runCli(JSON.stringify({ army: [] }));

    expect(JSON.parse(stdout)).toEqual({ score: 0 });
  }, 30000);
  it("scores an army beyond the type threshold end to end", async () => {
    const stdout = await runCli(
      JSON.stringify({
        army: [
          { monster: "sphinx" },
          { monster: "undead-warrior", rank: 1 },
          { monster: "undead-warrior", rank: 2 },
          { monster: "hydra" },
          { monster: "zombie" },
        ],
      }),
    );

    expect(JSON.parse(stdout)).toEqual({ score: 4 });
  }, 30000);
});
