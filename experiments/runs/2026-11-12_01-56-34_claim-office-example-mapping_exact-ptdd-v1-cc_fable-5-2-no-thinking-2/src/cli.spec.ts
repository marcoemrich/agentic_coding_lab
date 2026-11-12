import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const claimOffice = fileURLToPath(new URL("../claim-office", import.meta.url));

function runClaimOffice(scenario: unknown) {
  const { status, stdout, stderr } = spawnSync(claimOffice, { input: JSON.stringify(scenario), encoding: "utf8" });
  return { status, stdout, stderr };
}

describe("claim-office CLI", () => {
  it("schema example (5 years, amulet quote, fire claim of 200 G) -> exit 0, stdout {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };

    const { status, stdout, stderr } = runClaimOffice(scenario);

    expect({ status, stderr }).toEqual({ status: 0, stderr: "" });
    expect(JSON.parse(stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it("quote with unknown item type broomstick -> non-zero exit status, error description on stderr (reading: one line naming the problem, no stack trace), no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "broomstick" }] },
      ],
    };

    const { status, stdout, stderr } = runClaimOffice(scenario);

    expect(status).toBeGreaterThan(0);
    expect(stderr.trim().split("\n")).toEqual([expect.stringContaining("broomstick")]);
    expect(stdout).toBe("");
  });

  it("claim for an item that is not part of the policy -> non-zero exit status, error description on stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 300 }] } },
      ],
    };

    const { status, stderr } = runClaimOffice(scenario);

    expect(status).toBeGreaterThan(0);
    expect(stderr).toContain("amulet");
  });
});
