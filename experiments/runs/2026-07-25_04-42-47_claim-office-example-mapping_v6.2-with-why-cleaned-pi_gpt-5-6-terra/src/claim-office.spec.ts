import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const scenario = (steps: unknown[], yearsWithMHPCO = 0) => runScenario({ customer: { yearsWithMHPCO }, steps });

describe("MHPCO claim office", () => {
  it("quotes an empty item list for the 5 G processing fee", () => {
    expect(scenario([{ op: "quote", items: [] }])).toEqual({ results: [{ premium: 5 }] });
  });
  it.todo("quotes each main item at its base premium: sword 100, amulet 60, staff 80, potion 40 G");
  it.todo("quotes components: 2 runes 50 G, exactly 3 runes 60 G, 4 runes 100 G, and 7 runes 175 G");
  it.todo("treats only exact component types alike: 2 runes plus a moonstone 75 G and 3 of each 120 G");
  it.todo("applies cursed and enchantment-5 item surcharges only to affected item bases");
  it.todo("does not apply high enchantment at level 4 and stacks curse with high enchantment");
  it.todo("applies loyalty at exactly 2 years, initial assessment, and follow-up discount to policy base");
  it.todo("quotes newcomer cursed sword for 165 G");
  it.todo("quotes long-standing second-contract cursed enchantment-7 sword for 160 G");
  it.todo("rounds final premiums up, with fractions retained until final rounding");
  it.todo("rejects an unknown quote item without results");
  it.todo("pays regular sword damage 500 as 400 G and rune damage 200 as 100 G");
  it.todo("applies the 100 G deductible separately to each damage entry");
  it.todo("applies enchantment-8 half reimbursement before deductible, including dragon material");
  it.todo("fully reimburses dragon material below enchantment 8 before deductible");
  it.todo("tracks duplicate insured types and rejects excess or unlisted/unknown claim damage and negative damage");
  it.todo("uses twice unmodified insurance sum as cap, including component blocks, and exhausts it across claims");
  it.todo("rounds final payouts down, retaining fractional intermediate amounts");
  it("CLI reads scenario JSON from stdin and writes scenario results as JSON to stdout", async () => {
    const { runCli } = await import("./cli.js");
    expect(runCli('{"customer":{"yearsWithMHPCO":0},"steps":[{"op":"quote","items":[]}]}')).toBe('{"results":[{"premium":5}]}');
  });
  it("CLI reports invalid JSON or processing errors to stderr and exits non-zero without stdout results", async () => {
    const { spawn } = await import("node:child_process");
    const child = spawn(process.execPath, ["--import", "tsx", "src/cli.ts"]);
    child.stdin.write("not JSON");
    child.stdin.end();
    const [code, stdout, stderr] = await new Promise<[number | null, string, string]>((resolve) => {
      let stdout = "", stderr = "";
      child.stdout.on("data", chunk => { stdout += chunk; });
      child.stderr.on("data", chunk => { stderr += chunk; });
      child.on("close", code => resolve([code, stdout, stderr]));
    });
    expect(code).not.toBe(0);
    expect(stdout).toBe("");
    expect(stderr).toContain("Unexpected token");
  });
});
