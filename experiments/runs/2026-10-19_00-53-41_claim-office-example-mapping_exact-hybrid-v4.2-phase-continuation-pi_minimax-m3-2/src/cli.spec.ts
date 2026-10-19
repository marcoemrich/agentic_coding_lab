import { describe, it, expect } from "vitest";
import { runScenario } from "./cli.js";

describe("claim-office CLI", () => {
  describe("error handling for invalid input", () => {
    it("should exit non-zero with stderr message for quote with unknown item type (e.g. broomstick)", async () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      const result = await runScenario(input);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    });
    it("should exit non-zero with stderr message for claim referencing item not in policy (amulet damaged when only sword insured)", async () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      const result = await runScenario(input);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    });
    it("should exit non-zero with stderr message for claim with negative damage amount (amount: -200)", async () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      });
      const result = await runScenario(input);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    });
    it("should exit non-zero with stderr message for claim with more damages than policy covers (2 sword damages but only 1 sword insured)", async () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      });
      const result = await runScenario(input);
      expect(result.exitCode).not.toBe(0);
      expect(result.stderr).toBeTruthy();
    });
  });

  describe("successful execution", () => {
    it("should write JSON results to stdout for valid scenarios", async () => {
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });
      const result = await runScenario(input);
      expect(result.exitCode).toBe(0);
      const output = JSON.parse(result.stdout);
      expect(output.results).toHaveLength(2);
      expect(output.results[0]).toHaveProperty("premium");
      expect(output.results[1]).toHaveProperty("payout");
      expect(output.results[1]).toHaveProperty("remainingCap");
    });
  });
});
