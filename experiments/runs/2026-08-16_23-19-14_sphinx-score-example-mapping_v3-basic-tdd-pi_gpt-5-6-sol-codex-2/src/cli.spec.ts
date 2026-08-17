import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and writes its score as JSON", () => {
    const input = JSON.stringify({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
        { monster: "cyclops" },
      ],
    });

    const result = spawnSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      { cwd: process.cwd(), input, encoding: "utf8" },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 5 });
  });

  it("outputs zero for an army without a Sphinx", () => {
    const result = spawnSync(
      "pnpm",
      ["exec", "tsx", "src/cli.ts"],
      {
        cwd: process.cwd(),
        input: JSON.stringify({ army: [{ monster: "chimera" }] }),
        encoding: "utf8",
      },
    );

    expect(result.status, result.stderr).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ score: 0 });
  });
});
