import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { execute } from "./command.js";

const CLAIM_OFFICE_EXECUTABLE = fileURLToPath(new URL("../claim-office", import.meta.url));

function swordPolicyClaim(damages: { itemType: string; amount: number }[], policy = 0): string {
  return JSON.stringify({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy, incident: { cause: "dragon attack", damages } },
    ],
  });
}

describe("claim-office CLI", () => {
  describe("stdin/stdout contract", () => {
    it("valid scenario JSON on stdin -> exit status 0, results JSON on stdout, nothing on stderr", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      const outcome = execute(stdin);

      expect(outcome.exitCode).toBe(0);
      expect(JSON.parse(outcome.stdout)).toEqual({ results: [{ premium: 115 }] });
      expect(outcome.stderr).toBe("");
    });
  });

  // Chosen reading for all rejections: the whole scenario fails, so no results are written to stdout.
  describe("rejections: non-zero exit status, error description on stderr, no results on stdout", () => {
    it("quote includes an item with an unknown type (broomstick) -> non-zero exit, error on stderr, no results on stdout", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

      const outcome = execute(stdin);

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toContain("broomstick");
      expect(outcome.stdout).toBe("");
    });
    it("claim damages an item that is not part of the policy (amulet damaged, only a sword insured) -> non-zero exit, error on stderr", () => {
      const outcome = execute(swordPolicyClaim([{ itemType: "amulet", amount: 300 }]));

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toContain("amulet");
      expect(outcome.stdout).toBe("");
    });
    it("claim damages an item with an unknown type (broomstick) -> non-zero exit, error on stderr", () => {
      const outcome = execute(swordPolicyClaim([{ itemType: "broomstick", amount: 300 }]));

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toContain("broomstick");
      expect(outcome.stdout).toBe("");
    });
    it("claim contains a damage entry with amount -200 -> non-zero exit, error on stderr", () => {
      const outcome = execute(swordPolicyClaim([{ itemType: "sword", amount: -200 }]));

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toContain("-200");
      expect(outcome.stdout).toBe("");
    });
    it("claim has more damage entries of a type than the policy covers (two sword damages, one sword insured) -> non-zero exit, whole claim rejected", () => {
      const outcome = execute(
        swordPolicyClaim([
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ]),
      );

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toContain("sword");
      expect(outcome.stdout).toBe("");
    });
    it("claim refers to a step that created no policy -> non-zero exit, error on stderr (chosen reading: an invalid policy reference is rejected like other invalid claims)", () => {
      const stepWithoutPolicy = 7;

      const outcome = execute(swordPolicyClaim([{ itemType: "sword", amount: 500 }], stepWithoutPolicy));

      expect(outcome.exitCode).not.toBe(0);
      expect(outcome.stderr).toMatch(/policy.*7/i);
      expect(outcome.stdout).toBe("");
    });
  });

  describe("claim-office executable", () => {
    it("schema example piped through the executable -> exit status 0, stdout {\"results\":[{\"premium\":59},{\"payout\":100,\"remainingCap\":1100}]}, empty stderr", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      });

      const run = spawnSync(CLAIM_OFFICE_EXECUTABLE, { input: stdin, encoding: "utf8" });

      expect(run.status).toBe(0);
      expect(run.stdout.trim()).toBe('{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}');
      expect(run.stderr).toBe("");
    });
    it("unknown item type piped through the executable -> non-zero exit status, error description on stderr, empty stdout", () => {
      const stdin = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });

      const run = spawnSync(CLAIM_OFFICE_EXECUTABLE, { input: stdin, encoding: "utf8" });

      expect(run.status).not.toBe(0);
      expect(run.status).not.toBeNull();
      expect(run.stderr).toContain("broomstick");
      expect(run.stdout).toBe("");
    });
  });
});
