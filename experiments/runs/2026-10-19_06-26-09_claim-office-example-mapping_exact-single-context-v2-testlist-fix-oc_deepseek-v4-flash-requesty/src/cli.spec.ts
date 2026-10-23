import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));

function runCli(input: string) {
  return spawnSync(
    join(here, "..", "node_modules", ".bin", "tsx"),
    [join(here, "cli.ts")],
    { input, encoding: "utf8" }
  );
}

describe("Claim Office - CLI", () => {
  it(
    "should read a scenario from stdin and write results JSON to stdout with exit status 0 -- schema example produces {premium:59},{payout:100,remainingCap:1100}",
    () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
      const result = runCli(input);
      expect(result.status).toBe(0);
      expect(result.stdout).toBe(
        JSON.stringify({
          results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
        })
      );
    }
  );
  it(
    "should exit non-zero, write an error to stderr, and write nothing to stdout for a quote with an unknown item type -- {type: broomstick}",
    () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).not.toBe("");
    }
  );
  it(
    "should exit non-zero and write an error to stderr for a claim with a negative damage amount -- amount -200",
    () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "accident",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).not.toBe("");
    }
  );
  it(
    "should exit non-zero and write an error to stderr for a claim on an item not covered by the policy -- amulet damage when only a sword is insured",
    () => {
      const result = runCli(
        JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 100 }],
              },
            },
          ],
        })
      );
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).not.toBe("");
    }
  );
});