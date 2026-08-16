import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const cli = (input: string) => spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
  input,
  encoding: "utf8",
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and emits only its JSON result", () => {
    const result = cli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "potion" }] },
    ] }));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
    expect(result.stderr).toBe("");
  });

  it("reports invalid input on stderr without results on stdout", () => {
    const result = cli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] }));
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("unknown item type");
  });
});
