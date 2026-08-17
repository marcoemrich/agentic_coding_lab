import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

function runCli(input: unknown): unknown {
  const stdout = execFileSync(
    "pnpm",
    ["exec", "tsx", "src/cli.ts"],
    { input: JSON.stringify(input), encoding: "utf8" },
  );
  return JSON.parse(stdout) as unknown;
}

describe("Sphinx scoring CLI", () => {
  it("reads an army from stdin and emits its score as JSON", () => {
    expect(runCli({
      army: [
        { monster: "sphinx" },
        { monster: "chimera" },
        { monster: "orthrus" },
        { monster: "zombie" },
        { monster: "hydra" },
      ],
    })).toEqual({ score: 3 });
  });

  it("emits zero for an army without a Sphinx", () => {
    expect(runCli({ army: [{ monster: "hydra" }] })).toEqual({ score: 0 });
  });
});
